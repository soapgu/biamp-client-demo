const BiampClient = require('@shgbit/biamp-client');

const { DeviceBlock,MatrixMixerBlock,CommonBlock,BiampBlock} = BiampClient;


const main = async () => {
	console.log("---main begin---");
    const client = new BiampClient('10.20.10.200','main');
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
        await normalQueryCrosspointLevelState( client,mixer,inputNum,outputNum );
        await batchQueryCrosspointLevelState(client,mixer,inputNum,outputNum );
        const common = new CommonBlock();
        let mute = await client.sendTTPSimple( common.buildCommand('Mixer1',BiampBlock.get,'inputMute',BiampBlock.boolean,1) );
        let label = await client.sendTTPSimple( common.buildCommand('Mixer1',BiampBlock.get,'inputLabel',BiampBlock.string,1) );
        console.log(`MatrixMixer mute:${mute}  label:${label}`);
    
    }
    console.log(`end for main`);
};

/**
 * 
 * @param {BiampClient} client 
 * @param {BiampClient.MatrixMixerBlock} mixer 
 * @param {number} inputNum 
 * @param {number} outputNum 
 */
async function normalQueryCrosspointLevelState(client,mixer,inputNum,outputNum){
    const start = process.hrtime.bigint();
    for( let i=1;i<= inputNum;i++ ){
        for( let j=1;j <= outputNum;j++ ){
            let state = await client.sendTTPSimple( mixer.getCrosspointLevelState( i ,j ) );
            console.log(`input:${i} output:${j} queryMixerState result:${state}`);
        }
    }
    const end = process.hrtime.bigint();
    const elapsedTime = end - start;
    const elapsedMilliseconds = Number(elapsedTime) / 1_000_000;
    console.log(`normal query CrosspointLevelState timming: ${elapsedMilliseconds} ms`);
}

/**
 * 
 * @param {BiampClient} client 
 * @param {BiampClient.MatrixMixerBlock} mixer 
 * @param {number} inputNum 
 * @param {number} outputNum 
 */
async function batchQueryCrosspointLevelState(client,mixer,inputNum,outputNum) {
    const start = process.hrtime.bigint();
    let requests = [];
    for( let i=1;i<= inputNum;i++ ){
        for( let j=1;j <= outputNum;j++ ){
            let request = mixer.getCrosspointLevelState( i ,j );
            requests.push( request );
        }
    }
    console.log(`client request count:${requests.length}`);
    let results =  await client.sendTTPSimple(...requests);
    console.log(results)
    const end = process.hrtime.bigint();
    const elapsedTime = end - start;
    const elapsedMilliseconds = Number(elapsedTime) / 1_000_000;
    console.log(`batch query CrosspointLevelState timming: ${elapsedMilliseconds} ms`);
}

main().catch(error => {
	console.error('============= main catched error:', error);
});