import express from "express";
import commentsModel from "./model.js";
import q2m from "query-to-mongo";

const commentsRouter = express.Router();

commentsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);

    const total = await commentsModel.countDocuments(mongoQuery.criteria);

    const comments = await commentsModel
      .find(mongoQuery.criteria, mongoQuery.options.fields)
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.options.limit)
      .sort(mongoQuery.options.sort);
    res.send({
      links: mongoQuery.links("http://localhost:3002/blogs", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      comments,
    });
  } catch (error) {
    next(error);
  }
});

export default commentsRouter;
