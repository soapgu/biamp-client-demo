const biampClient = require('@shgbit/biamp-client');

const { DeviceBlock,MatrixMixerBlock } = biampClient;




const main = async () => {
	console.log("---main begin---");
    const client = new biampClient('172.16.13.52','main');
    console.log("<<<<<<< begin connect biamp >>>>>>>");
    let connect = await client.makeConnect();
    console.log(`<<<<<<< end connect biamp,result${connect} >>>>>>>`);
    if( connect ){
        console.log("<<<<<<< begin get serial number >>>>>>>");
        let sn = await client.sendTTPSimple( DeviceBlock.getSerialNumber());
        console.log(`serial number is ${sn}`);
    }
    console.log(`end for main`);
    
};

main().catch(error => {
	console.error('============= main catched error:', error);
});