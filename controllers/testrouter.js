const router = require('express').Router();

const UssdModel = require('../models/ussd-model');

// const GraphInsert = require('../models/graphTable-model');


const db = require('../database/dbConfig');

const homesesh = () => {
    return db('graphTable').where({id:1});
}


// let page = db('graphTable').select('name').where({id:1});
let page = "";

function getSessionInfo(body) {

    //let page = await db('graphTable').select('name').where({id:1});

    const session = {
      session_id: body.sessionId,
      phone_num: body.phoneNumber,
      service_code: body.serviceCode,
      text: body.text,
    //   page: body.page, 
    };

    // if (!body.page) {
    //     session.page = "";
    // }

    return session;
  }




router.get('/', async(req, res) =>{

    const session = getSessionInfo(req.body);
    
    let homeText = await homesesh();

    // page = "string";

    console.log(homeText[0]["text"]);
    console.log('page ', page);
    
    res.send(homeText[0]["text"]);

    // res.send('test output home page')
})

// Post receives data like the following from AfricaTalks
// {
// 	"sessionId": "135351351351",
// 	"phoneNumber": "8675309",
// 	"networkCode": "Verizon or Something...",
// 	"serviceCode": "+44454545?",
// 	"text": "1"
// }

const newpagehold = async(request, current) => {
    console.log('newpagehold');
}

const newscreen = async(curSession, request) => {

    const newSessionInfo = {
        session_id: curSession.session_id,
        phone_num: curSession.phone_num,
        service_code: curSession.service_code,
        text: curSession.text,
        page: curSession.page, 
      };    

    let newscreen = "";

    if (request == "") {

        console.log('Page on no text entry POST req: ', curSession.page);

        if (curSession.page == null){
            let respo = await homesesh();

            let newscreen = respo[0]["name"];

            console.log('newscreen ', newscreen );

            newSessionInfo.page = respo[0]["name"];

            console.log('newSessionInfo to update: ', newSessionInfo);

            let update = await UssdModel.updateSessionPage(curSession, newscreen)

            console.log('updated session info: ', update);

            return newscreen;
        }
        else {
            newscreen = curSession.page;

            console.log('newscreen ', newscreen );

            return newscreen;
        }
        
        
    }
    else {
        // PREVIOUS/GO BACK REQUEST //
        if (request == "99") {
            console.log('curSession.page contents: ', curSession.page)
            const choice = await db('graphTable').where({name : curSession.page});
            
            console.log('choice: ',choice[0]['previous'])
            if (choice[0]['previous'] == "" || !choice[0]['previous']) {
                newscreen = curSession.page;
            }
            else {
                newscreen = choice[0]['previous'];
            }

            let update = await UssdModel.updateSessionPage(curSession, newscreen)

            console.log('updated session info: ', update);

            return newscreen;
        }

        // GO HOME REQUEST //
        else if (request == "00") {
            let respo = await homesesh();

            let newscreen = respo[0]["name"];

            console.log('newscreen ', newscreen );

            newSessionInfo.page = respo[0]["name"];

            console.log('newSessionInfo to update: ', newSessionInfo);

            let update = await UssdModel.updateSessionPage(curSession, newscreen)

            console.log('updated session info: ', update);

            return newscreen;
        }

        else if (request) {
            console.log('request to number options');
            for (i = 1; i < 10; i ++) {
                let numby = i.toString();
                
                if (request === numby) {
                    console.log('curSession.page contents: ', curSession.page)
                    const choice = await db('graphTable').where({name : curSession.page});
                    
                    // console.log('choice: ',choice[0]);
                    console.log('choice: ',choice[0]['Cons'][`${i-1}`]);

                    if (choice[0]['Cons'][`${i-1}`] == "" || !choice[0]['Cons'][`${i-1}`]) {
                        newscreen = curSession.page;
                    }
                    else {
                        newscreen = choice[0]['Cons'][`${i-1}`];
                    }

                    let update = await UssdModel.updateSessionPage(curSession, newscreen)

                    console.log('updated session info: ', update);

                    // current = newscreen;
                    return newscreen;
                }
            }

        }

    }
 
}


router.post('/', async (req, res) => {

    // const clean = cleanSessions();

    const session = getSessionInfo(req.body);

    console.log('session info: ', session);
    
    // if (!session.session_id) {
    //     console.log('NO EXISTING ID...')
    //     session = getSessionInfo(req.body);
    // }
    
    const service = await UssdModel.startSession(session);

    console.log("texted number ", session.text);
    console.log("session in DB ", service[0]);
    
    let screen = await newscreen(service[0], session.text);

    //page = screen;

    console.log('current screen ', screen);
    //console.log('page ', page);

    let display = await UssdModel.getScreen(screen);




    // let options = await display.map(ops => {
    //     console.log('options', ops.Options);
    // })

    let opsy = [];

    let options = await display.map(ops => {
        // console.log('options', ops.Options);
        // opsy.push(ops.Options);
        // console.log('new options: ', opsy);
        for (l=0; l < ops.Options.length; l++) {
            opsy.push(ops.Options[l]);
        }

    })

    let opsyNew = await opsy.forEach(function(oppy) {
        console.log('oppy:',oppy);
        let popsicle = "";
        popsicle = oppy;
        return `${popsicle}`;
    })

    let opsyNew2 = await opsy.map(thing =>{
        // console.log(thing);
        return (`${thing}\n`);
    }).join('')

    


    console.log('display: ', display);

    res.send(`
        ${display[0].text}

        ${opsyNew2}        
        `)
})


module.exports = router;



// Previous, and thus the '99' option no longer function correctly after
// the array conversion of the backend.  Previous data IS BEING UPDATED to
// new data with every page view. Function of the previous command needs
// the work

// need to work out function to account for TEXT INPUT coming in a concat
// string like " 0*1*2*99*5*2 "  MAYBE... that's how AT api says it comes in
// don't know if that's how Sauti's is or not yet...


// work out how to delete session data every X amount of minutes/hours
