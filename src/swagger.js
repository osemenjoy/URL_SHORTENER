/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is healthy
 */

/**
 * @swagger
 * /shorten:
 *   post:
 *     summary: Create a shortened URL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               alias:
 *                 type: string
 *     responses:
 *       201:
 *         description: Short link created
 *       400:
 *         description: Invalid input or alias already taken
 */

/**
 * @swagger
 * /{alias}:
 *   get:
 *     summary: Redirect to original URL or preview link data
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *         description: Short link alias
 *       - in: query
 *         name: preview
 *         required: false
 *         schema:
 *           type: string
 *           example: "true"
 *         description: Set to true to return JSON instead of redirect
 *     responses:
 *       200:
 *         description: Returns link data in preview mode
 *       302:
 *         description: Redirects to original URL
 *       404:
 *         description: Link not found
 */

/**
 * @swagger
 * /{alias}/restore:
 *   patch:
 *     summary: Restore a deleted shortened URL
 *     parameters:
 *       - in: path
 *         name: alias
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Link restored
 *       404:
 *         description: Link not found
 */

export default {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'URL Shortener API',
      version: '1.0.0',
      description: 'A simple URL shortener service',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local development server',
      },
    ],
  },
  apis: ['./src/swagger.js'],
};
