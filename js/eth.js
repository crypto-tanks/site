;( async () => {
	
	if( window.ethereum ){
		await window.ethereum.send('eth_requestAccounts')
		window.web3 = new Web3( window.ethereum )
	}

	const network_chainId = '0x38';
	const network_params = {
		chainId: '0x38',
		chainName: 'Binance Smart Chain',
		nativeCurrency: {
			name: 'Binance Smart Chain',
			symbol: 'BNB',
			decimals: 18
		},
		blockExplorerUrls: [
			'https://bscscan.com'
		],
		rpcUrls: [
			'https://bsc-dataseed1.binance.org:443'
		],
	};	

	/*const network_chainId = '0x61';
	const network_params = {
		chainId: '0x61',
		chainName: 'Smart Chain - Testnet',
		nativeCurrency: {
			name: 'Binance',
			symbol: 'BNB',
			decimals: 18
		},
		blockExplorerUrls: [
			'https://testnet.bscscan.com'
		],
		rpcUrls: [
			'https://data-seed-prebsc-1-s1.binance.org:8545/'
		],
	};*/

	const contract_Address = '0x327251b125669B98C6e50E708CdCf53780C8380f'
    const ipfs_contract_source = 'QmbuJxaRV7PpVYG16WDGEsz4fhvE93nX9mY9kZbdyQAjVV'
    // QmPdfzxZKHRe3qvurrAK5jbz3t2tuTP6EVRcwobqvDYLxu
    const abi = await fetch(`https://ipfs.io/ipfs/${ipfs_contract_source}`).then(res => res.json()).then( e => e.output.abi );
	/*const scenary = await fetch('abi.json').then(res => res.json())
	const abi = scenary.abis[Object.keys(scenary.abis)[0]]*/
	const contract = new web3.eth.Contract( abi, contract_Address )

	window.eth = {
			
		address: null,
		contract: false,
		prices: [],
        
        async auth (){			
			await eth.switchEthereumChain()			
			try {				
				if( !eth.address && window.ethereum && window.web3 ){
					web3.eth.getAccounts().then( accounts => {
						eth.address = accounts[0]
                        $('[data-interactive="connected-status"]').text('Connected')
                        eth.buttons_prices()
                        eth.list()
					})
				}
			} catch( errr ) {}			
		},
		
		async switchEthereumChain(){
			return new Promise(( resolve, reject ) => {				
				window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: network_chainId }],
				})
				.then( resolve )
				.catch( () => {
					window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [ network_params ]
					})
					.then( resolve )
					.catch( reject )
				})
			})
			
		},
		
		async buttons_prices(){

            eth.prices.push('0');

			let price_1 = await contract.methods.rates(1).call()
			let price_2 = await contract.methods.rates(2).call()
			let price_3 = await contract.methods.rates(3).call()
			let price_4 = await contract.methods.rates(4).call()
            
            $('.js-prices-1').text( web3.utils.fromWei( price_1 ) )
            $('.js-prices-2').text( web3.utils.fromWei( price_2 ) )
            $('.js-prices-3').text( web3.utils.fromWei( price_3 ) )
            $('.js-prices-4').text( web3.utils.fromWei( price_4 ) )

            eth.prices.push( price_1 );
            eth.prices.push( price_2 );
            eth.prices.push( price_3 );
            eth.prices.push( price_4 );
            
		},

		async list(){

			let getTokenIds = await contract.methods.getTokenIds( eth.address ).call()
			let getTemplatesIds = await contract.methods.getTemplatesIds( eth.address ).call()

            let grid = {};
            let ind = 0
            getTokenIds.forEach( tokId => {
                let tplId = getTemplatesIds[ind]
                if( grid['tpl'+tplId] === undefined ){
                    grid['tpl'+tplId] = 0
                }
                grid['tpl'+tplId]++;
                ind++
            })
           
            for (let key in grid) {
                if (Object.hasOwnProperty.call(grid, key)) {
                    let count = grid[key];
                    let e = key.replace('tpl', '');
                    $(`span.js-template-${e}`).text( count )
                }
            }

            console.log('grid', grid );
            console.log('getTokenIds', getTokenIds );
            console.log('getTemplatesIds', getTemplatesIds );

        },
		
        async mint( level = 1 ){

            contract.methods.mint( eth.address, 1, level ).send({
            //contract.methods.minted( eth.address, level ).send({
				from: eth.address,
				gas: 300000,
				//value: priceWei
			})
			
			.then( res => {
				if( res.status == true ){
                    iziToast.success({
                        title: 'BSC',
                        message: 'Successfully purchase!',
                    });
					eth.list()
				}else{
                    iziToast.error({
                        title: 'BSC',
                        message: 'Failed to buy',
                    });
                }
			})
			 
			.catch( err => {
				iziToast.error({
                    title: 'BSC',
                    message: 'Failed to buy',
                });
			})

        },

		pay( level = 1, qty = 1 ){
					
			let priceWei = ( eth.prices[level] !== undefined ) ? eth.prices[level] : eth.prices[1]
            
			contract.methods.mint( eth.address, qty, level ).send({
				from: eth.address,
				gas: 300000,
				value: priceWei
			})
			
			.then( res => {
                console.log('res ok', res);
				if( res.status == true ){
                    iziToast.success({
                        title: 'BSC',
                        message: 'Successfully purchase!',
                    });
					eth.list()
				}else{
                    iziToast.error({
                        title: 'BSC',
                        message: 'Failed to buy',
                    });
                }
			})
			 
			.catch( err => {
				iziToast.error({
                    title: 'BSC',
                    message: 'Failed to buy',
                });
			})
			
		},

        async withdraw(){
			contract.methods.withdraw().send({
				from: eth.address,
				gas: 300000
			})			
			.then( res => {
				console.log( 'successfull', res )
			})
			.catch( err => {
				console.log( 'error', res )
			})
        },

        async owner(){
            contract.methods.owner().call().then( data => { console.log( 'withdraw ok!', data ) });
        },

        async add_coin(){
            
            const tokenAddress = '0x9bD1185d55Fa03B7f2B6509DA2594A318054Af4e';
            const tokenSymbol = 'TankToken';
            const tokenDecimals = 18;
            const tokenImage = 'https://ipfs.io/ipfs/Qme358mdqXuN7GJyXmZpf24i7ezFU25yFbTxsHTgKCzxgX?filename=CryptoTanks.png';

            try {

                // wasAdded is a boolean. Like any RPC method, an error may be thrown.
                const wasAdded = await window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20', // Initially only supports ERC20, but eventually more!
                        options: {
                            address: tokenAddress, // The address that the token is at.
                            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                            decimals: tokenDecimals, // The number of decimals in the token
                            image: tokenImage, // A string url of the token logo
                        },
                    },
                });

                if (wasAdded) {
                    console.log('Thanks for your interest!');
                } else {
                    console.log('Your loss!');
                }

            } catch (error) {
                console.log(error);
            }
        }
		
	}

    await window.eth.auth()


})();