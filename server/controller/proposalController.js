require("dotenv").config();
const Proposal = require("../models/proposal");
// const User = require("../Models/user");
const { GridFSBucket, MongoClient } = require("mongodb");
const mongoClient = new MongoClient(process.env.DB_URL);


//TO GET ALL PROPOSALS
const getAllProposals = async (req, res) => {
    try {
        let proposals = await Proposal.find();
        res.status(200).json({ status: "Success", proposals });
    } catch (err) {
        res.status(400).json({ status: "Failed", message: err.message });
    }
}

// TO GET ALL PROPOSALS CREATED BY SPECIFIC VENDOR 
const getVendorProposals = async (req, res) => {
    try {
        // let vendor = await 
        let proposals = await Proposal.find({ vendorId: req.params.id });
        res.status(200).json({ status: "Success", proposals });
    } catch (err) {
        res.status(400).json({ status: "Failed", message: err.message });
    }
}

//TO CREATE NEW PROPOSAL
const addNewProposal = async (req, res) => {
    try {
        const arr = req.files.map(file => file.filename);
        let proposal = await new Proposal({
            ...req.body,
            images: [...arr]
        })
        proposal = await proposal.save();
        res.status(200).json({ status: "Success", proposal });
    } catch (err) {
        res.status(400).json({ status: "Failed", message: err.message });
    }
}

//TO RENDER THE IMAGE
const renderImage = async (req, res) => {

    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB_NAME);
        const bucket = new GridFSBucket(db, {
            bucketName: process.env.DB_IMAGE_COLLECTION
        });

        const image = bucket.openDownloadStreamByName(req.params.name);
        image.on("data", data => res.status(200).write(data));
        image.on("error", err => res.status(400).send({ msg: err.message }));
        image.on("end", () => res.end());
    } catch (err) {
        res.status(500).send({ msg: err.message });
    }
}

//TO DELETE THE PROPOSAL
const deleteProposal = async (req, res) => {
    try {
        await mongoClient.connect();
        const db = mongoClient.db(process.env.DB_NAME);
        const filesSchema = db.collection(process.env.DB_IMAGE_COLLECTION + ".files");
        const chunksSchema = db.collection(process.env.DB_IMAGE_COLLECTION + ".chunks");

        let post = await Proposal.findById(req.params.id)
        if (!post) return res.status(404).json({ status: "Failed", message: "Invalid Id" });
        post.images.forEach(async (filename) => {
            //del chunck
            let file = await filesSchema.findOne({ filename: filename });
            await chunksSchema.deleteMany({ files_id: file._id });
            //del file
            await filesSchema.deleteOne({ _id: file._id });
        })
        //del post
        await Proposal.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "Success" });


    } catch (err) {
        res.status(400).json({ status: "Failed", message: err.message });
    }
}

module.exports = { getAllProposals, getVendorProposals, addNewProposal, deleteProposal };