import React from "react";
import "../../App.css";
import Web3 from "web3";

export default function SignInPage() {
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [verifierOutput, setVerifierOutput] = React.useState(null);
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
      console.log("verifier output", verifierOutput);
      if (verifierOutput) {
        if (verifierOutput === true) {
          setLoading(false);
          window.location.pathname = "home";
        } else {
          alert("Authentication failed");
        }
      }
    }
    attemptLogin();
  }, [verifierOutput]);

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
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "string", name: "addres", type: "string" },
          { internalType: "string", name: "mail", type: "string" },
          { internalType: "string", name: "_hash", type: "string" },
        ],
        name: "verifyChallenge",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
      },
    ];
    var contractAddress = "0xca802c762fcb5092d7f374a092d0209c24f7e91c";

    const instance = new web3.eth.Contract(abi, contractAddress);

    // request for challenge
    await instance.methods
      .authChallenge(accounts[0], email)
      .send({
        from: accounts[0],
      })
      .then(async () => {
        // challenge solution
        var solution = wallet + "9" + email;

        // call verifier with solution
        const verifierResult = await instance.methods
          .verifyChallenge(accounts[0], email, solution)
          .call();

        // set the verifier output to state
        setVerifierOutput(verifierResult);
      });
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
