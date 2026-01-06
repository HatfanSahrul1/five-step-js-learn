
const FILE_STATE = {
    IDLE : "IDLE",
    PROCESS : "PROCESS",
    SUCCESS : "SUCCESS",
    FAILED : "FAILED"
};

const state = {
    files : [],
    nextFileId : 1
};

function addFile(name) {
    return new Promise((success, failed)=>{
        if (name === '') failed({"status" : "failed"});

        const file = {
          id: state.nextFileId++,
          name,
          status: FILE_STATE.IDLE,
        };
        state.files.push(file);
        success({fileId: file.id, fileName: file.name});
    })
}

async function processFile(file) {
  if (file.status !== FILE_STATE.IDLE) {
    throw new Error(`File ${file.id} cannot be processed`);
  }

  file.status = FILE_STATE.RUNNING;
  console.log(`file ${file.id} started`);

  try {
    const {time} = await fakeAsyncWork();
    file.status = FILE_STATE.SUCCESS;
    return {time};
  } catch (err){
    file.status = FILE_STATE.FAILED;
    throw new Error(err);
  }
}

function fakeAsyncWork() {
  return new Promise((success, failed) => {
    const delay = parseInt(2000 + Math.random() * 1000);
    setTimeout(() =>{
        if((delay) % 2 === 0) success({status : "success", time : delay});
        else failed(`Failed to proceed file. Time consume : ${delay}`);
    }, delay);
  });
}

async function processFileById(id) {
  const file = state.files.find((t) => t.id === Number(id));
  if (!file) {
    throw new Error('File not found');
  }
  const result = await processFile(file);
  return {
    message: `File ${file.id} processed successfully`,
    time: result.time
  };
}

function listFiles() {
  return state.files.map((t) => ({
    id: t.id,
    name: t.name,
    status: t.status
  }));
}

function showFileStatus(id) {
  const file = state.files.find((t) => t.id === Number(id));
  if (!file) {
    return null;
  }
  return {
    id: file.id,
    name: file.name,
    status: file.status
  };
}

module.exports = {
    addFile,
    showFileStatus,
    listFiles,
    processFileById
};