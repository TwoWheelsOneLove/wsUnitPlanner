window.addEventListener('load', initialize);

function initialize(){
  window.searchUnits.addEventListener('click', loadUnits);
  window.addUnit.addEventListener('click', openUnitCreator);
  window.home.addEventListener('click', showSearchResults);
  document.getElementById('submitNewUnit').addEventListener('click', submitUnit);
  document.getElementById("saveChanges").addEventListener('click', saveUnit);
  loadUnits();
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
  window.addUnit.setAttribute("style", "display: none;")
  window.home.setAttribute("style", "display: block;")
  window.createUnit.setAttribute("style","left:5vw; display:grid;")
}



//opens the unit editor with the details parsed
function openUnitEditor(unit){
  window.addUnit.setAttribute("style", "display: none;");
  window.home.setAttribute("style", "display: block;");

  let saveBtn = document.getElementById("saveChanges").children[0];
  saveBtn.dataset.id = unit.id;

  let editor = document.getElementById('unitEditor');
  editor.setAttribute("style", "display: block;");

  let details = document.getElementById('unitDetails');
  let authorField = document.getElementById('editAuthor');
  let titleField = document.getElementById('editTitle');

  authorField.textContent = unit.author;
  titleField.value = unit.title;

}




//API OPERATIONS
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
}

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
      el.onclick = requestDelete;
      unitTools.appendChild(el);
    });
  }

  async function requestDelete(e){
    if(e.target.dataset.id && window.confirm('Are you sure you want to delete this unit?')){
      await fetch('/api/units/' + e.target.dataset.id, {method:'DELETE'});
      loadUnits();
    }
  }

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

  async function submitUnit(){
    const userName = document.getElementById("creatorName");
    const unitName = document.getElementById("unitName");
    const weeks = document.getElementById("unitWeeks");

    const submitButton = document.getElementById("submitNewUnit");
    submitButton.textContent = 'submitting unit ...';
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

  function unitSubmitted(){
    document.getElementById("creatorName").value="";
    document.getElementById("unitName").value="";
    document.getElementById("unitWeeks").value="";

    showSearchResults();
  };
