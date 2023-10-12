'use strict';

/**
 * chatbot service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::chatbot.chatbot');
