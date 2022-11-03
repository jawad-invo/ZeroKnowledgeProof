import React from "react";
// import { sha256 } from "js-sha256";
import "../../App.css";
import Web3 from "web3";
import CryptoJS from "crypto-js";

export default function SignInPage() {
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [challenge, setChallenge] = React.useState(null);
  const [walletButtonAddress, setWalletButtonAddress] =
    React.useState("Connect Wallet");
  const [wallet, setWallet] = React.useState("Connect Wallet");
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function connectMetamas() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        add();
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
      } else {
        window.alert(
          "Non-Ethereum browser detected. You should consider trying MetaMask!"
        );
      }
    }
    async function add() {
      const web3 = window.web3;
      const webeProvider = new Web3(Web3.givenProvider);
      const accounts = await webeProvider.eth.getAccounts();
      console.log("Wallet address is :", accounts[0]);
      setWalletButtonAddress(
        accounts[0].slice(0, 4) + "..." + accounts[0].slice(-2)
      );
      setWallet(accounts[0]);
    }
    connectMetamas();
  }, []);

  function handleChangePassword(event) {
    event.preventDefault();
    setPassword(event.target.value);
  }

  function handleChangeEmail(event) {
    event.preventDefault();
    setEmail(event.target.value);
  }

  async function handleAuth(event) {
    event.preventDefault();
    setLoading(true);
    await createChanllange();
  }

  React.useEffect(() => {
    async function attemptLogin() {
      if (challenge) {
        setLoading(false);
        window.location.pathname = "home";
      } else {
        alert("Authentication failed");
      }
    }
    attemptLogin();
  }, [challenge]);

  async function connect() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async function createChanllange() {
    const web3 = window.web3;
    const webeProvider = new Web3(Web3.givenProvider);
    const accounts = await webeProvider.eth.getAccounts();

    var abi = [
      {
        inputs: [
          { internalType: "string", name: "addres", type: "string" },
          { internalType: "string", name: "email", type: "string" },
        ],
        name: "authChallenge",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "string", name: "address", type: "string" },
          { internalType: "string", name: "solvedChallenge", type: "string" },
        ],
        name: "verifyChallenges",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    var contractAddress = "0xA9c32a68fa2d65654a0EB65CbC3D797f2103D7F6";

    const instance = new web3.eth.Contract(abi, contractAddress);
    const challenge = await instance.methods
      .authChallenge(accounts[0], email)
      .send({
        from: accounts[0],
      });
    // Solve the Given Challenge
    const computedChallegeValue = `${wallet}.${email}.12`;
    // verifier
    const verifedSolution = await instance.methods
      .verifyChallenges(accounts[0], computedChallegeValue)
      .call();
    setChallenge(verifedSolution);
    // setTimeout(async () => {}, 10000);
  }

  return (
    <div className="text-center m-5-auto">
      <form onSubmit={handleAuth}>
        <p>
          <label>Username or email</label>
          <br />
          <input
            type="text"
            name="email"
            required
            onChange={handleChangeEmail}
          />
        </p>
        {/* <p>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            required
            onChange={handleChangePassword}
          />
        </p> */}
        <p>
          {loading ? (
            <button id="sub_btn" type="submit" disabled={loading}>
              <i className="fa fa-circle-o-notch fa-spin"></i> Authenticating
            </button>
          ) : (
            <button id="sub_btn" type="submit" disabled={loading}>
              Login
            </button>
          )}

          <button
            onClick={connect}
            id="sub_btn"
            style={{ marginTop: "20px", background: "green" }}
          >
            {walletButtonAddress}
          </button>
        </p>
      </form>
      <footer style={{ color: "white" }}>
        {/* <p>
          First time?{" "}
          <Link to="/register" style={{ color: "white" }}>
            Create an account
          </Link>
          .
        </p> */}
      </footer>
    </div>
  );
}
