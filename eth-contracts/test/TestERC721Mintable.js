var ERC721MintableComplete = artifacts.require('RealestokenERC721Token');  //RealestokenERC721Token  ERC721MintableComplete

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
            //console.log("Contract is:", this.contract)

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1, { from: account_one });
            await this.contract.mint(account_one, 2, { from: account_one });
            await this.contract.mint(account_two, 3, { from: account_one });
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply.call();
            console.log("Number of total supply is:", totalSupply)
            assert.equal(3, totalSupply, "There should be three tokens.");
        })

        it('should get token balance', async function () { 
            let bal = await this.contract.balanceOf.call(account_one);
            assert.equal(2, bal, "Account One should have 2 tokens.");

            bal = await this.contract.balanceOf.call(account_two);
            assert.equal(1, bal, "Account Two should have 1 token.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {             
            let tokenUriOne = await this.contract.tokenURI.call(1);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1", tokenUriOne, "URI of token with ID = 1 is not correct.");

            let tokenUriTwo = await this.contract.tokenURI.call(2);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2", tokenUriTwo, "URI of token with ID = 2 is not correct.");

            let tokenUriThree = await this.contract.tokenURI.call(3);
            assert.equal("https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3", tokenUriThree, "URI of token with ID = 3 is not correct.");
        })

        it('should transfer token from one owner to another', async function () { 
            try 
            {
                await this.contract.transferFrom(account_one, account_two, 2, { from: account_one });
            }
            catch(e) {
                console.log('TransferFrom failed.', e);
            }

            let ownerOfOne = await this.contract.ownerOf.call(1);
            assert.equal(account_one, ownerOfOne, "Oner of token id = 1  not correct.");

            let ownerOfTwo = await this.contract.ownerOf.call(2);
            assert.equal(account_two, ownerOfTwo, "Oner of token id = 2 not correct.");

            let ownerOfThree = await this.contract.ownerOf.call(3);
            assert.equal(account_two, ownerOfThree, "Oner of token id = 3 not correct.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let accessDenied = false;
            try  {
                await this.contract.mint(account_one, 4, { from: account_two });
            } catch(e) {
                accessDenied = true;
            }
            assert.equal(true, accessDenied, "Mint action is not authorized for this account.");

            let balanceTwo = await this.contract.balanceOf.call(account_two);
            assert.equal(0, balanceTwo, "Account Two should have 0 tokenss.");
        })

        it('should return contract owner', async function () {             
            let owner = await this.contract.getOwner.call();
            assert.equal(account_one, owner, "The contract owner shold be Account One.");
        })

    });
})