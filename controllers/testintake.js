// Dependencies
const router = require('express').Router();

// Models
// const Users = require('../models/user-models');
// const Workflows = require('../models/workflow-models');

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


router.post('/', async (req, res) => {
    
    let content = req.body;

    let overId = content.id;
    console.log('Overall ID ', overId);

    let nodes = content.nodes;
    console.log('Nodes : ', nodes);

    res.send(overId);


    //res.send('Hey, you tried to send something')

});






module.exports = router;