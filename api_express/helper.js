
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
    console.log(`File ${file.id} cannot be Proceed`);
    return;
  }

  file.status = FILE_STATE.RUNNING;
  console.log(`file ${file.id} started`);

  try {
    const {time} = await fakeAsyncWork();
    file.status = FILE_STATE.SUCCESS;
    return;
  } catch (err){
    file.status = FILE_STATE.FAILED;
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

function processFileById(id) {
  const file = state.files.find((t) => t.id === Number(id));
  if (!file) {
    console.log("file not found");
    return;
  }
  processFile(file);
}

function listFiles() {
  state.files.forEach((t) => {
    console.log(`[${t.id}] ${t.name} - ${t.status}`);
  });
}

function showFileStatus(id) {
  const file = state.files.find((t) => t.id === Number(id));
  if (!file) {
    console.log("Task not found");
    return;
  }
  console.log(`Task ${file.id} is ${file.status}`);
}

module.exports = {
    addFile,
    showFileStatus,
    listFiles,
    processFileById
};