var RealestokenERC721Token = artifacts.require('RealestokenERC721Token');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

const proof = {
    "proof": {
        "a": ["0x0e832ac9328765188c8cb491bc9d05933306121220652cb2e3ff74bcab0dde76", "0x20683de8120bdea2e614022a4810b70594bc8d0bbf664f9db49b921a0a35935e"],
        "b": [["0x1fea5afcc8562f6b44ba532563a56aa0218855f80066928870f0065716f4f68a", "0x20593feb8c14bfb1a0257c886ff5e3a0098621a1e6c002b5cfdc394fca890011"], ["0x010372305017eee712fb33a56052f924f3cb2a72e15ab0fbd4d7a71c9cc67389","0x2f6f9315f2692c0c2c26093615770861bd615e098d1620b22a59af7b135fd87e"]],
        "c": ["0x23aff1359980b9fa43aee401d8e085efd58266dce73dc1abfb16fec7678f09f2", "0x09d2e9fe2f86cc4da8df7d58b5a3269e4bb0101ba8352c1855f1abd1208dc08c"]
    },
    "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000007","0x0000000000000000000000000000000000000000000000000000000000000000"]
};

contract('TestSolnSquareVerifier', async(accounts) => {
    beforeEach(async function () { 
      this.solnSquareVerifier = await SolnSquareVerifier.new({from: accounts[0]});
      this.contract = await RealestokenERC721Token.new({from: accounts[0]});  
    });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it('a new solution can be added for contract', async function () { 
        await this.solnSquareVerifier.add(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, {from: accounts[0]});

        let solutions = await this.solnSquareVerifier.solutions(0);
        assert.equal(0, solutions.index, "There should only be one solution");
        assert.equal(accounts[0], solutions.sender, "The only solution should be added by the msg.sender.");
    })

    // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
    it('an ERC721 token can be minted for contract', async function () { 
        await this.solnSquareVerifier.mint(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, 2, {from: accounts[0]});
    
        // var owener = await this.solnSquareVerifier.ownerOf(tokenIndex);
        // assert.equal(owener, accounts[0], "Minted token has incorrect owner");

        // await this.solnSquareVerifier.verifyAndMint(proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs, 2, {from: accounts[0]});

        // let solutions = await this.solnSquareVerifier.solutions(0);
        // assert.equal(0, solutions.index, "One solution should be added with index 0.");
        // assert.equal(accounts[0], solutions.sender, "One solution should be added by msg.sender.");

        var totalSupply = await this.solnSquareVerifier.totalSupply.call();
        assert.equal(1, totalSupply, "There should be 1 token.");

        var balance = await this.solnSquareVerifier.balanceOf.call(accounts[0]);
        assert.equal(1, balance, "AThe first account should have one token.");
        })
})
