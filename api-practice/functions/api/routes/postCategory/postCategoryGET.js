const _ = require('lodash');
const functions = require('firebase-functions');
const util = require('../../../lib/util');
const statusCode = require('../../../constants/statusCode');
const responseMessage = require('../../../constants/responseMessage');
const db = require('../../../db/db');
const { postCategoryDB, relationPostPostCategoryDB, postDB, likeDB } = require('../../../db');
const arrayHandlers = require('../../../lib/arrayHandlers');

module.exports = async (req, res) => {
  const { postCategoryId } = req.params;

  let client;

  try {
    client = await db.connect(req);

    const postCategory = await postCategoryDB.getPostCategoryById(client, postCategoryId);

    const rPPCs = await relationPostPostCategoryDB.getRelationPostPostCategoriesByPostCategoryId(client, postCategoryId);

    const postIds = arrayHandlers.extractValues(rPPCs, 'postId');
    const posts = await postDB.getPostsByIds(client, postIds);

    const rPPCsByPostIds = await relationPostPostCategoryDB.getRelationPostPostCategoriesByPostIds(client, postIds);

    const postCategoryIds = arrayHandlers.extractValues(rPPCsByPostIds, 'postCategoryId');

    const postCategories = await postCategoryDB.getPostCategoryByIds(client, postCategoryIds);

    const likes = await likeDB.getLikesByLikeItemIds(client, postIds, 1);

    for (let i = 0; i < rPPCsByPostIds.length; i++) {
      rPPCsByPostIds[i].postCategory = _.find(postCategories, (o) => o.id === rPPCsByPostIds[i].postCategoryId);
    }

    for (let i = 0; i < posts.length; i++) {
      posts[i].postCategories = _.filter(rPPCsByPostIds, (o) => o.postId === posts[i].id).map((o) => o.postCategory);
      posts[i].likeCount = _.filter(likes, (o) => o.likeItemId === posts[i].id).length;
      posts[i].didILike = _.find(likes, (o) => o.userId === req.user.id) ? true : false;
    }

    const data = {
      postCategory: {
        ...postCategory,
        posts,
      },
    };

    res.status(statusCode.OK).send(util.success(statusCode.OK, responseMessage.READ_ALL_USERS_SUCCESS, data));
  } catch (error) {
    functions.logger.error(`[ERROR] [${req.method.toUpperCase()}] ${req.originalUrl}`, `[CONTENT] ${error}`);
    console.log(error);

    res.status(statusCode.INTERNAL_SERVER_ERROR).send(util.fail(statusCode.INTERNAL_SERVER_ERROR, responseMessage.INTERNAL_SERVER_ERROR));
  } finally {
    client.release();
  }
};

const data = {
  category: {
    id: 1,
    name: '일상',
    posts: [
      {
        id: 1,
        userId: 4,
        postCategories: [
          {
            id: 1,
            name: '일상',
          },
          {
            id: 2,
            name: '회고',
          },
        ],
      },
      {
        id: 2,
        userId: 15,
        postCategories: [
          {
            id: 1,
            name: '일상',
          },
          {
            id: 3,
            name: '대학교',
          },
        ],
      },
    ],
  },
};
