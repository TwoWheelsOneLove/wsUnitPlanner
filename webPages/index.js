window.addEventListener('load', initialize);
let dragged;

function initialize(){
  document.getElementById('searchUnits').addEventListener('click', loadUnits);
  document.getElementById('addUnit').addEventListener('click', openUnitCreator);
  document.getElementById('home').addEventListener('click', showSearchResults);
  document.getElementById('submitNewUnit').addEventListener('click', submitUnit);
  document.getElementById("saveChanges").addEventListener('click', saveUnit);

  let addLec = document.getElementById("AddLecture");
  addLec.addEventListener('click', addContent);
  addLec.dataset.contentType = "Lecture";

  let addPrac = document.getElementById("AddPractical");
  addPrac.addEventListener('click', addContent);
  addPrac.dataset.contentType = "Practical";

  let addTop = document.getElementById("AddTopic");
  addTop.addEventListener('click', addContent);
  addTop.dataset.contentType = "Topic";

  let addRes = document.getElementById("AddResource");
  addRes.addEventListener('click', addContent);
  addRes.dataset.contentType = "Resource";

  //removes default drag over behaviour
  let sandbox = document.getElementById("sandbox")

  sandbox.addEventListener("dragover", (e) => {
	e.preventDefault();
  });

  sandbox.addEventListener("drop", contentDropped);

  //load units on the homepage
  loadUnits();
}



//DRAG DROP OPERATIONS
function contentDrag(e){
  dragged = e.target;
  dragged.style.opacity = 0.5;
}

function contentDragEnd(e){
  dragged = e.target;
  dragged.style.opacity = 1;
}

function contentDropped(e){
  //Check to see if content has been dropped on a week, in the sandbox, or in a lecture/practical
  if (event.target.classList.contains("week") || event.target.id == "sandbox"){
    dragged.parentNode.removeChild(dragged);
    event.target.appendChild(dragged);

    updateContentLocation(dragged, event.target);
  }
}

//USER INTERFACE OPERATIONS
  //Returns to the homepage/unit search UI
function showSearchResults(){
  document.getElementById('unitEditor').setAttribute("style", "display: none;");
  document.getElementById('createUnit').setAttribute("style","left:150vw; display:none;");
  document.getElementById('addUnit').setAttribute("style", "display: block;");
  document.getElementById('search').setAttribute("style", "display: block;");
  document.getElementById('searchUnits').setAttribute("style", "display: block;");
  document.getElementById('home').setAttribute("style", "display: none;");
  loadUnits();
}

function openUnitCreator(){
  document.getElementById('addUnit').setAttribute("style", "display: none;")
  document.getElementById('home').setAttribute("style", "display: block;")
  document.getElementById('createUnit').setAttribute("style","left:5vw; display:grid;")
}

//opens the unit editor with the details parsed
async function openUnitEditor(unit){
  document.getElementById('addUnit').setAttribute("style", "display: none;");
  document.getElementById('home').setAttribute("style", "display: block;");

  //clear editing space of previously edited unit
  let weekContainer = document.getElementById("weeks");
  let sandbox = document.getElementById('sandbox');
  weekContainer.innerHTML = "";
  weekContainer.textContent = "";
  sandbox.innerHTML ="";
  sandbox.textContent = "";

  //Add ID of unit to be edited to button datasets
  let saveBtn = document.getElementById("saveChanges").children[0];
  let addLecture = document.getElementById("AddLecture");
  let addPractical = document.getElementById("AddPractical");
  let addTopic = document.getElementById("AddTopic");
  let addResource = document.getElementById("AddResource");
  addLecture.dataset.id = unit.id;
  saveBtn.dataset.id = unit.id;
  addPractical.dataset.id = unit.id;
  addTopic.dataset.id = unit.id;
  addResource.dataset.id = unit.id;

  //display the editing screen
  let editor = document.getElementById('unitEditor');
  editor.setAttribute("style", "display: block;");

  let details = document.getElementById('unitDetails');
  let authorField = document.getElementById('editAuthor');
  let titleField = document.getElementById('editTitle');

  authorField.textContent = unit.author;
  titleField.value = unit.title;

  let weeks = await getWeeks(unit.id);

  //get content that isnt currently in a unit
  let unitContent = await getUnitContent(unit.id);


  unitContent.forEach((content) =>{
    if (!content.weekId){
      displayContent(unit, content, sandbox);
    }
  })

  //cycle through weeks
  for (let week of weeks){

    //get content specific to this week
    let weekContent = await getWeekContent(week.id);

    const newWeek = document.createElement('section');
    newWeek.classList.add('week');

    //removes default drag over behaviour
    newWeek.addEventListener("dragover", (e) => {
  	e.preventDefault();
    });

    newWeek.textContent = "Week: " + week.weekNum;
    newWeek.dataset.id = week.id;
    weekContainer.appendChild(newWeek);
    weekContainer.addEventListener("drop", contentDropped);


    weekContent.forEach((content) =>{
      displayContent(unit, content, newWeek);
    })

  }
}

function displayContent(unit, content, location){
  const contentBox = document.createElement('div');
  contentBox.classList.add('unitContent');
  contentBox.draggable = true;
  contentBox.dataset.id=content.id;
  contentBox.classList.add(content.contentType);
  contentBox.addEventListener("dragstart", contentDrag);
  contentBox.addEventListener("dragend", contentDragEnd);
  location.appendChild(contentBox);

  const contentHeader = document.createElement('h4');
  contentHeader.textContent = content.contentType;
  contentBox.appendChild(contentHeader);

  const contentDelete = document.createElement('i');
  contentDelete.classList.add('material-icons');
  contentDelete.textContent='delete';
  contentDelete.dataset.id = unit.id;
  contentDelete.dataset.contentId = content.id;
  contentDelete.onclick = deleteContent;
  contentHeader.appendChild(contentDelete);


  if (content.contentType =="Practical" || content.contentType =="Lecture"){
    let details = document.createElement("div");
    details.classList.add("contentDetails");
    contentBox.appendChild(details);

    let leaderP = document.createElement('p');
    leaderP.textContent = "Leader: ";
    details.appendChild(leaderP);

    let leaderInput = document.createElement('input');
    leaderInput.maxLength = 20;
    leaderInput.value = content.leader;
    leaderInput.addEventListener("blur", updateLeader);
    details.appendChild(leaderInput);

    let noteDiv = document.createElement('div');
    noteDiv.classList.add("contentNotes")
    contentBox.appendChild(noteDiv);

    let noteP = document.createElement('p');
    noteP.textContent = "Notes: ";
    noteDiv.appendChild(noteP);

    let noteInput = document.createElement('textarea');
    noteInput.maxLength = 200;
    noteInput.textContent = content.notes;
    noteDiv.appendChild(noteInput);
    noteInput.addEventListener("blur", updateNote);
  }

  if (content.contentType =="Topic"){
    const topicTitle = document.createElement('textarea');
    topicTitle.textContent = content.topicTitle;
    contentBox.appendChild(topicTitle);
    topicTitle.addEventListener("blur", updateTopicTitle);

    const topicDesc = document.createElement('textarea');
    topicDesc.textContent = content.topicDesc;
    contentBox.appendChild(topicDesc);
    topicDesc.addEventListener("blur", updateTopicDesc);

  }

  if (content.contentType =="Resource"){
    const contentText = document.createElement('textarea');
    contentText.textContent = content.resourceLink;
    contentBox.appendChild(contentText);
    contentText.addEventListener("blur", updateResource);

  }
}

//display units on the page
function displayUnits(units){
  window.main.innerHTML = '';


  units.forEach((unit) => {
      const container = document.createElement('section');
      container.classList.add('unit')
      window.main.appendChild(container);

      const title = document.createElement('h4');
      title.classList.add('title');
      title.textContent = unit.title;
      container.appendChild(title);

      const author = document.createElement('h4');
      author.textContent = unit.author;
      author.classList.add('author');
      container.appendChild(author);

      const unitTools = document.createElement('div');
      unitTools.classList.add('unitTools');
      container.appendChild(unitTools);

      let el = document.createElement('i');
      el.classList.add('material-icons');
      el.textContent='edit';
      el.dataset.id = unit.id;
      el.onclick = editUnit;
      unitTools.appendChild(el);

      el = document.createElement('i');
      el.classList.add('material-icons');
      el.textContent='delete';
      el.dataset.id = unit.id;
      el.onclick = deleteUnit;
      unitTools.appendChild(el);
    });
  }

//API OPERATIONS

//get content for a unit based on its ID
async function getUnitContent(id){
  try{
  let url = '/api/weekContent';
  url += '?unitId=' + encodeURIComponent(id);
  const response = await fetch(url);

  if (!response.ok) throw response;
    let content = await response.json();
    return content;
  } catch (e) {
    console.error('error getting content details', e);
  }
}

//get content for a week based on its ID
async function getWeekContent(id){
  try{
  let url = '/api/weekContent';
  url += '?weekId=' + encodeURIComponent(id);
  const response = await fetch(url);

  if (!response.ok) throw response;
    let content = await response.json();
    return content;
  } catch (e) {
    console.error('error getting content details', e);
  }
}

//update/saving functions
async function updateTopicTitle(e){
  let content = e.target.parentNode;

  let url = '/api/content';
  url += '?contentId=' + encodeURIComponent(content.dataset.id);
  url += '&topicTitle=' + encodeURIComponent(e.target.value);

  try{
    const response = await fetch(url, {method:'put'});
    if (!response.ok) throw response;
    } catch (e) {
      console.error('error saving topic title', e);
    }
}

async function updateTopicDesc(e){
  let content = e.target.parentNode;

  let url = '/api/content';
  url += '?contentId=' + encodeURIComponent(content.dataset.id);
  url += '&topicDesc=' + encodeURIComponent(e.target.value);

  try{
    const response = await fetch(url, {method:'put'});
    if (!response.ok) throw response;
    } catch (e) {
      console.error('error saving topic description', e);
    }
}

async function updateResource(e){
  let content = e.target.parentNode;

  let url = '/api/content';
  url += '?contentId=' + encodeURIComponent(content.dataset.id);
  url += '&resource=' + encodeURIComponent(e.target.value);

  try{
    const response = await fetch(url, {method:'put'});
    if (!response.ok) throw response;
    } catch (e) {
      console.error('error saving resource', e);
    }
}

async function updateNote(e){
  let notes = e.target.parentNode;
  let content = notes.parentNode;

  let url = '/api/content';
  url += '?contentId=' + encodeURIComponent(content.dataset.id);
  url += '&note=' + encodeURIComponent(e.target.value);

  try{
    const response = await fetch(url, {method:'put'});
    if (!response.ok) throw response;
    } catch (e) {
      console.error('error saving note', e);
    }
}

async function updateLeader(e){
  let details = e.target.parentNode;
  let content = details.parentNode;

  let url = '/api/content';
  url += '?contentId=' + encodeURIComponent(content.dataset.id);
  url += '&leader=' + encodeURIComponent(e.target.value);

  try{
    const response = await fetch(url, {method:'put'});
    if (!response.ok) throw response;
    } catch (e) {
      console.error('error saving note', e);
    }
}

//update the location of the content in the db after a Succesfull drop
async function updateContentLocation(content, dropLocation){
  let url = '/api/content';
  url += '?contentId=' + encodeURIComponent(content.dataset.id);

  if(dropLocation){
    let newLoc;

    if(dropLocation.id = "sandbox"){newLoc = null}

    if(dropLocation.classList.contains("week")){
      newLoc = dropLocation.dataset.id
    }

      url += '&newWeekId=' + encodeURIComponent(newLoc);
  }

  try{
    const response = await fetch(url, {method:'put'});
    if (!response.ok) throw response;
    } catch (e) {
      console.error('error saving content', e);
    }
};

//save unit details
async function saveUnit(e){
  console.log(e.target);
  let newTitle = document.getElementById('editTitle').value;

  let url = '/api/units';
  url += '?id=' + encodeURIComponent(e.target.dataset.id);
  url += '&title=' + encodeURIComponent(newTitle);

  try{
    const response = await fetch(url, {method:'put'});
    if (!response.ok) throw response;
    } catch (e) {
      console.error('error saving unit', e);
    }

    let alertString = newTitle + " Saved Succesfully";
    alert(alertString);

    //refresh the unit screen
    editUnit(e);
}

//load all of the units
async function loadUnits(){
  try{
    window.main.innerHTML='Gathering Units...';

    let url = '/api/units';

    if(window.search.value){
       url += '?search=' + encodeURIComponent(window.search.value);
    }

    const response = await fetch(url);
    if (!response.ok) throw response;
      displayUnits(await response.json());

    } catch (e) {
      console.error('error getting units', e);
      window.main.innerHTML = 'sorry, something went wrong...';
    }
  }

  //confirm with user and delete unit
  async function deleteUnit(e){
    if(e.target.dataset.id && window.confirm('Are you sure you want to delete this unit?')){
      await fetch('/api/units/' + e.target.dataset.id, {method:'DELETE'});
      alert("Unit Deleted");
      loadUnits();
    }
  }

  async function deleteContent(e){
    if(e.target.dataset.id){
      await fetch('/api/content/' + e.target.dataset.contentId, {method:'DELETE'});
      editUnit(e);
    }
  }

  //Open the unit editor when the edit button is clicked
  async function editUnit(e){
    try{
      let url = '/api/units';
      url += '?id=' + encodeURIComponent(e.target.dataset.id);

      const response = await fetch(url);

      if (!response.ok) throw response;
        let unit = await response.json();
        unit = unit[0];
        console.log(unit);

        openUnitEditor(unit);
      } catch (e) {
        console.error('error getting unit details', e);
      }

  }

  //get all weeks by unit ID
  async function getWeeks(unitID){
    try{
      let url = '/api/weeks';
      url += '?id=' + encodeURIComponent(unitID);

      const response = await fetch(url);

      if (!response.ok) throw response;
        let weeks = await response.json();
        return weeks;
      } catch (e) {
        console.error('error getting weeks', e);
      }
    }

  //Add content to the unit
  async function addContent(e){
    let url='/api/content';
    url +='?id=' + encodeURIComponent(e.target.dataset.id);
    url +='&type=' + encodeURIComponent(e.target.dataset.contentType);

    disableButtons();

    const response = await fetch(url, {method:'post'});

    editUnit(e);
  }

  function disableButtons(){
    document.getElementById("saveChanges").children[0].disabled=true;
    document.getElementById("AddLecture").disabled=true;
    document.getElementById("AddPractical").disabled=true;
    document.getElementById("AddTopic").disabled=true;
    document.getElementById("AddResource").disabled=true;

    setTimeout(enableButtons, 1000)

  }

  function enableButtons(){
    document.getElementById("saveChanges").children[0].disabled=false;
    document.getElementById("AddLecture").disabled=false;
    document.getElementById("AddPractical").disabled=false;
    document.getElementById("AddTopic").disabled=false;
    document.getElementById("AddResource").disabled=false;
  }


  //submit a new unit
  async function submitUnit(){
    const userName = document.getElementById("creatorName");
    const unitName = document.getElementById("unitName");
    const weeks = document.getElementById("unitWeeks");

    //checks that fields are valid/not empty
    if (userName.value.replace(/\s+/g, '').length == 0 || unitName.value.replace(/\s+/g, '').length == 0 || weeks.value == 0){
      alert("Please fill in all fields to create a unit")
    }else{
            const submitButton = document.getElementById("submitNewUnit");
            let alertString = "We've Created " + unitName.value + " for you " + userName.value;
            alert(alertString);
            submitButton.disabled = true;

            let url = '/api/units';
            url += '?title=' + encodeURIComponent(unitName.value);
            url += '&author=' + encodeURIComponent(userName.value);
            url += '&weeks=' + encodeURIComponent(weeks.value);

            const response = await fetch(url, {method:'post'});

            submitButton.disabled = false;
            submitButton.textContent = 'Create Unit';


            if (response.ok) {
                unitSubmitted();
            } else {
                console.error('error creating unit', response.status, response.statusText);
            }
    }
  }

  function unitSubmitted(){
    document.getElementById("creatorName").value="";
    document.getElementById("unitName").value="";
    document.getElementById("unitWeeks").value="";

    showSearchResults();
  };

//Alert popup to the user, to alert of validation errors/system status
  function alert(message){
   const alert = document.getElementById("windowAlert");
   alert.textContent = message;
   alert.setAttribute("style","top:0; opacity:1;")
   window.setTimeout(clearAlert, 2000);
  }

  function clearAlert(){
    const alert = document.getElementById("windowAlert");
    alert.textContent="";
    alert.setAttribute("style","top:-30vh; opacity:0;")
  }
