//Defunct COMMENTS: This was built by the Lambda X v1 team. This was the prototype of the graph-parser used to convert
//                  the JSON object into nodes in our database
// Dependencies
const router = require('express').Router();

// Models
// const Users = require('../models/user-models');
const Workflows = require('../models/workflow-models');
const GraphInsert = require('../models/graphTable-model');

// Middleware

function getNodes(data) {
    for (i = 0; i > data.length; i++) {
        print(data.nodes.id)
    }
}

// Get Workflow JSON into DB

router.get('/', async (req,res) => {
    res.send('Primary JSON intake server is running')
});


async function dataSet(info) {

    let nodes = info.nodes;
    let links = info.links;

    

    console.log('node length ', nodes.length);

    for (i=0; i<nodes.length; i++) {
    
        let newPage = {
            name: '',
            text: '',
            Options: [],
            Cons: [],
        }

        // need to add PORT label data to intake data to be displayed
    
        console.log('working with node: ', nodes[i].id );

        newPage.name = nodes[i].id;
        newPage.text = nodes[i].description;

        let options = nodes[i].ports;

        for (k=1; k<options.length; k++) {
            //
            // console.log(options[k].label);
            newPage.Options.push(options[k].label)
        }

        for (j=0; j<links.length; j++){
            // console.log('working with link: ',links[i].id, 'which starts at ', links[i].source);

            let ins = 1;

            if (nodes[i].id == links[j].source) {
                newPage.Cons.push(links[j].target);
            }
        }

        console.log('newPage obj: ', newPage);

        await GraphInsert.insert(newPage);
    }

}

router.post('/', async (req, res) => {
    
    let content = req.body;

    let overId = content.id;
    // console.log('Overall ID ', overId);

    let nodes = content.nodes;
    // console.log('Nodes : ', nodes);

    await dataSet(content);

    console.log('node 0 id check : ',nodes[0].id)
    res.send(overId);


    //res.send('Hey, you tried to send something')

});






module.exports = router;