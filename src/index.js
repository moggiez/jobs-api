"use strict";
const AWS = require("aws-sdk");

const db = require("@moggiez/moggies-db");
const helpers = require("@moggiez/moggies-lambda-helpers");
const auth = require("@moggiez/moggies-auth");

const { Handler } = require("./handler");
const { InternalHandler } = require("./internalHandler");

const DEBUG = false;
const TABLE_CONFIG = {
  tableName: "jobs",
  hashKey: "JobId",
  sortKey: "TaskId",
  indexes: {
    OrganisationJobs: {
      hashKey: "OrganisationId",
      sortKey: "JobId",
    },
  },
};

const debug = (event, response) => {
  const body = {
    response: "Hello from jobs-api!",
    request: event,
  };
  if (DEBUG) {
    response(200, body);
  }
};

const getRequest = (event) => {
  const user = auth.getUserFromEvent(event);
  const request = helpers.getRequestFromEvent(event);
  request.user = user;

  return request;
};

exports.handler = async function (event, context, callback) {
  const table = new db.Table({
    config: TABLE_CONFIG,
    AWS: AWS,
  });
  if ("isInternal" in event && event.isInternal) {
    if (DEBUG) {
      return event;
    }

    const internalHandler = new InternalHandler({ table });
    return await internalHandler.handle(event);
  } else {
    const response = helpers.getResponseFn(callback);
    try {
      debug(event, response);
    } catch (err) {
      response(500, err);
    }
    const handler = new Handler(table);

    await handler.handle(getRequest(event), response);
  }
};
