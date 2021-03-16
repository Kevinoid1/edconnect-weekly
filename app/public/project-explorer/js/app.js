
//Remember the dry coding principle (Don't repeat yourself)
//fetch is the modern way of doing AJAX calls. Ajax stands for asynchronous
//javascript and XML. fetch is an asynchronous method and it is of Promise class. 
//Hence the .then and .catch methods. The placeholder "response" is the result of the fulfilled promise
//json() is a method in the response object that is returned from the fetch method call.
//APIs are applications built on web servers. This is what your are going to use back-end to build.
const getData = async function (url = ''){
   const response = await fetch(url,{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'
        },
    })
    return response.json()
}

// function for posting the collected data from a form
const postData = async function (url = '', data ={}){
    const response = await fetch(url,{
         method: 'post',
         headers: {
             'Content-Type' : 'application/json'
         },
         body : JSON.stringify(data)
     })
       return response
    
 }

 // makes the values of the select tags dynamic
function populateData(data, selector = ''){
    let staticData = document.querySelectorAll(selector);
    let i = 0;
     for ( let option of staticData){
         option.value = data[i];
         i++;
     }
     return staticData;
 } 

 //Collects all the values entered in a form. Here the accumulator is an object literal
//Since the accumulator is specified, it starts at index 0 and takes the first input
//as an object literal. Hence the spread operator(...) input.id : input.value is stored in the accumulator
//wrapping input.id with [] because it is a property i want to select. keys are marked with "".
function getFormValues (cssSelector = ''){
    let formValues = Array.from(document.querySelectorAll(cssSelector)).reduce(((acc, input) => {
        return { ...acc, [input.id] : input.value}
    }), {});
    return formValues;
}
//'.sign-up .sign-up_group'; selector for formValues

//function to render error.
function renderError(info, tagOne ='', tagTwo= '',className = '' , childNode, text){ //tagOne- parent tag; tagTwo- child tag
    let createdDiv = document.createElement(tagOne);
    createdDiv.className = 'alert alert-danger';
    createdDiv.setAttribute('role', 'alert');
    console.log(info)
    
    //Add series of errors to the div tag.
    if (info.errors.length === 0 ){
        
        let content = document.createTextNode(text);
        let paragraph= document.createElement(tagTwo);
        paragraph.appendChild(content);
        createdDiv.appendChild(paragraph);
        let insertParent = document.querySelector(className);
        insertParent.insertBefore(createdDiv, insertParent.childNodes[childNode])
    } 
    if (typeof(info.errors)==='string'){
        let content = document.createTextNode(info.errors);
        let paragraph= document.createElement(tagTwo);
        paragraph.appendChild(content);
        createdDiv.appendChild(paragraph);
        let insertParent = document.querySelector(className);
        insertParent.insertBefore(createdDiv, insertParent.childNodes[childNode])
    }
    else {
        let i =0;
        let content = [];
        let paragraphs = [];
        for(let message of info.errors){
            content[i] = document.createTextNode(message)
            paragraphs[i]= document.createElement(tagTwo);
            paragraphs[i].appendChild(content[i]);
            createdDiv.appendChild(paragraphs[i]);
            i++;
        }
        let insertElement = document.querySelector(className)
        insertElement.insertBefore(createdDiv, insertElement.childNodes[childNode]);
    }
}

//function to create cookie
function createCookie (info, name){
    console.log(info.data.id)
    document.cookie = `${name}=${info.data.id}; domain=; path=/;`
}


//function to delete cookie
const deleteCookie = function(name){
    let cookieValue = cookieCheck(name);
    document.cookie = `${name}=${cookieValue};domain=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`
}


    

//check for cookie
const cookieCheck = function(name){
        if(document.cookie){
        let cookieValue = document.cookie.split(';')
        .find((row) => row.startsWith(name))
        .split('=')[1]
        .trim();
        return cookieValue
       } else return null
}

let cookieVal = cookieCheck('uid');
if (cookieVal){
    getData(`/api/users/${cookieVal}`).then((data) =>{
        console.log(data)
        let logout = document.querySelector('.select-one');
        let userInfo = document.querySelector('.select-two');
        logout.text = 'Logout';
        logout.setAttribute('id', 'logout');
        userInfo.setAttribute('id', 'username')
        userInfo.text = `Hi, ${data.firstname}`
        userInfo.setAttribute('href', '#');
        logout.addEventListener('click', function(){
            deleteCookie('uid');
            logout.setAttribute('href', 'index.html')
        })
    })
}
        

if (window.location.href.includes('register.html')){
    getData('/api/programs').then((data) => {
        console.log(data)
        populateData(data, '#program option')
        });
    getData('/api/graduationYears').then((data) => {
        console.log(data)
        return populateData(data, '#gradYear option')
        });
    
    let myForm = document.querySelector('#signupForm');
    let cond;
    myForm.addEventListener('submit', function(e){
        e.preventDefault();
        let data = getFormValues('.sign-up .sign-up_group');
        console.log(data)
        let registerResponse = postData('/api/register', data);
        let parser = registerResponse.then((response) => {
            if (response.status === 200){
                cond = true;
            } 
            return response.json();
        })
        parser.then((answer) =>{
            if(cond === true){
                createCookie(answer, 'uid')
                window.location.replace('/project-explorer/index.html');
            } else{
                renderError(answer, 'div', 'p', '.insert', 2,)
            }
        }).catch((error) =>{
            console.log(error);
        })
    })
}

if (window.location.href.includes('index.html')){
    window.onload = function(){
        getData('/api/projects').then((projects) =>{
            console.log(projects);
        let projectTitle =document.querySelectorAll('.card-title');
        let projectAuthors = document.querySelectorAll('.card-subtitle');
        let projectAbstract = document.querySelectorAll('.card-text');
        let projectTag = document.querySelectorAll('.card-link');
        //delete all the old tags
        for(let f = 0; f < (projectTag.length);f++){
            projectTag[f].innerHTML=""
        }
        
        for(let project = 0; project<4;project++){
            projectTitle[project].innerHTML=""
            const prjTitle = document.createElement('a');
            const prjTag = document.createElement('a');
            prjTitle.href = `viewproject.html?id=${projects[project].id}`
            prjTitle.textContent = projects[project].name;
            projectAuthors[project].textContent = [projects[project].authors];
            projectAbstract[project].textContent = projects[project].abstract;
            prjTag.innerHTML = projects[project].tags.join('   ');
            prjTitle.className = 'card-title';
            prjTag.className = 'card-link'
            parentElement = document.querySelectorAll('.card-body');
            parentElement[project].insertBefore(prjTitle, parentElement[project].childNodes[0]);
            parentElement[project].appendChild(prjTag);

        }
        })
    }
}


if (window.location.href.includes('login.html')){
    window.onload = function(){
        let form = document.querySelector('.login-form');
        form.setAttribute('id', 'loginForm');
        let cond;
        form.addEventListener('submit', function(event){
            event.preventDefault();
            let formValues = getFormValues('.login-form .login-form_input');
            console.log(formValues);
            const loginResponse = postData('/api/login', formValues);
            const parsedLoginResponse = loginResponse.then((response) =>{
                if (response.status ===200){
                    cond = true;
                }
                return response.json();
            })
            parsedLoginResponse.then((info) =>{
                if(cond === true){
                    createCookie(info, 'uid');
                    window.location.replace('/project-explorer/index.html');
                } else{
                    let text = 'Invalid email/password';
                    renderError(info, 'div', 'p', '.insert', 2, text );
                }
            })
        })
    }
}
    

if (window.location.href.includes('createproject.html')){
    let cookiePresent = document.cookie.split(';').find((row) => row.startsWith('uid='))
        if(cookiePresent){
            let form = document.querySelector('#createProjectForm');
            form.addEventListener('submit', function(event){
                event.preventDefault();
                let formValues = getFormValues('#createProjectForm .project');
                let arryAuthor = formValues.authors.split(', ');
                formValues.authors = arryAuthor;
                console.log(formValues);
                let arryTags = formValues.tags.split(', ');
                formValues.tags = arryTags;
                let cond;
                postData('/api/projects', formValues).then((response) =>{
                    if (response.status ===200){
                        cond =true;
                    }
                    return response.json();
                }).then((data) =>{
                    if (cond){
                        console.log(data);
                        window.location.replace('/project-explorer/index.html');
                    } else{
                        renderError(data, 'div', 'p', '.insert', 2);
                    }
                })
            })
        }
        else{
            window.location.replace('/project-explorer/login.html');
        }
    }

    if (window.location.href.includes('viewproject.html')){
        let queryParam = location.search;
        console.log(queryParam);
        let search = new URLSearchParams(queryParam);
        let projectid = search.get('id');
        getData(`/api/projects/${projectid}`).then((data) =>{
            console.log(data);
            let projectName = document.getElementById('project_name');
            projectName.textContent = data.name;
            let projectAbstract = document.getElementById('project_abstract');
            projectAbstract.textContent = data.abstract;
            let projectAuthors = document.querySelectorAll('#project_authors > :first-child');
                let returnedAuthors = data.authors;
                if (data.authors.length ===2){
                    projectAuthors.innerHTML = `${data.authors[0]}<br>${data.authors[1]}`;
                } else {
                    projectAuthors.innerHTML = `${data.authors[0]}<br>`;
                }
                
            
            let projectTags = document.querySelector('#project_tags a');
            projectTags.textContent = data.tags.join('    ');
            getData(`/api/users/${data.createdBy}`).then((response) =>{
                console.log(response);
               let lastField = document.getElementById('project_author');
               lastField.innerHTML = `<p class = "col">Created by<br><strong>${response.firstname} ${response.lastname}</strong></p>`;
                 
            })
        })
        


    }
