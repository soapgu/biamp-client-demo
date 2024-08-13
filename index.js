const biampClient = require('@shgbit/biamp-client');

const { DeviceBlock,MatrixMixerBlock } = biampClient;




const main = async () => {
	console.log("---main begin---");
    const client = new biampClient('172.16.13.52','main');
    console.log("<<<<<<< begin connect biamp >>>>>>>");
    let connect = await client.makeConnect();
    console.log(`<<<<<<< end connect biamp,result:${connect} >>>>>>>`);
    if( connect ){
        console.log("<<<<<<< begin get serial number >>>>>>>");
        let sn = await client.sendTTPSimple( DeviceBlock.getSerialNumber());
        console.log(`serial number is ${sn}`);

        console.log("<<<<<<< begin get MatrixMixer state >>>>>>>");

        const mixer = new MatrixMixerBlock('Mixer1');
        let inputNum = await client.sendTTPSimple( mixer.getInputCount() );
        let outputNum =  await client.sendTTPSimple(mixer.getOutputCount());
        console.log(`MatrixMixer is input:${inputNum} ✖️ output:${outputNum}`);
        for( let i=1;i<= inputNum;i++ ){
            for( let j=1;j <= outputNum;j++ ){
                let state = await client.sendTTPSimple( mixer.getCrosspointLevelState( i ,j ) );
                console.log(`input:${i} output:${j} queryMixerState result:${state}`);
            }
        }
    }
    console.log(`end for main`);
    
};

main().catch(error => {
	console.error('============= main catched error:', error);
});