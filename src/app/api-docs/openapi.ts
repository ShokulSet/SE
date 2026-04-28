const spec = {
  openapi: '3.0.0',
  info: {
    title: 'Venue Explorer API',
    version: '1.0.0',
    description: 'Backend API for Venue Explorer — restaurants, menus, reservations, preorders, and reviews.',
  },
  servers: [
    { url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', description: 'Backend server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          tel: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
        },
      },
      Restaurant: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          address: { type: 'string' },
          tel: { type: 'string' },
          opentime: { type: 'string', example: '08:00' },
          closetime: { type: 'string', example: '22:00' },
          averageRating: { type: 'number' },
          reviewCount: { type: 'number' },
          category: { type: 'string' },
          imageUrl: { type: 'string' },
        },
      },
      Review: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          restaurantId: { type: 'string' },
          userId: { type: 'string' },
          rating: { type: 'number', minimum: 1, maximum: 5 },
          description: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Reservation: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          restaurantId: { type: 'string' },
          userId: { type: 'string' },
          date: { type: 'string', format: 'date', example: '2025-06-01' },
          time: { type: 'string', example: '18:00' },
          partySize: { type: 'integer', example: 2 },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      MenuItem: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          category: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string' },
          venueId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      PreorderItem: {
        type: 'object',
        properties: {
          menuId: { type: 'string' },
          name: { type: 'string' },
          price: { type: 'number' },
          quantity: { type: 'integer' },
        },
      },
      Preorder: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          venueId: { type: 'string' },
          items: { type: 'array', items: { $ref: '#/components/schemas/PreorderItem' } },
          total: { type: 'number' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
  paths: {
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'tel'],
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 6 },
                  tel: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive a JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    token: { type: 'string' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/api/v1/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User profile',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/v1/restaurants': {
      get: {
        tags: ['Restaurants'],
        summary: 'Get all restaurants',
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by name' },
          { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Filter by category' },
          { name: 'sort', in: 'query', schema: { type: 'string' }, description: 'Sort field (e.g. name, averageRating)' },
          { name: 'limit', in: 'query', schema: { type: 'integer' }, description: 'Max results to return' },
        ],
        responses: {
          200: {
            description: 'List of restaurants',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    count: { type: 'integer' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Restaurant' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/restaurants/{id}': {
      get: {
        tags: ['Restaurants'],
        summary: 'Get a single restaurant',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Restaurant details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Restaurant' },
                  },
                },
              },
            },
          },
          404: { description: 'Not found' },
        },
      },
    },
    '/api/v1/restaurants/{id}/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'Get reviews for a restaurant',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ID' }],
        responses: {
          200: {
            description: 'List of reviews',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Reviews'],
        summary: 'Create a review for a restaurant',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Restaurant ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['rating'],
                properties: {
                  rating: { type: 'number', minimum: 1, maximum: 5 },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Review created' },
          401: { description: 'Unauthorized' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/api/v1/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'Get all reviews (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'All reviews',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Review' } },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/v1/reviews/{id}': {
      put: {
        tags: ['Reviews'],
        summary: 'Update a review',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Review ID' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  rating: { type: 'number', minimum: 1, maximum: 5 },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Review updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
        },
      },
      delete: {
        tags: ['Reviews'],
        summary: 'Delete a review',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Review ID' }],
        responses: {
          200: { description: 'Review deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
        },
      },
    },
    '/api/v1/reservations': {
      get: {
        tags: ['Reservations'],
        summary: 'Get current user reservations',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of reservations',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Reservation' } },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Reservations'],
        summary: 'Create a reservation',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['restaurantId', 'date', 'time', 'partySize'],
                properties: {
                  restaurantId: { type: 'string' },
                  date: { type: 'string', format: 'date', example: '2025-06-01' },
                  time: { type: 'string', example: '18:00' },
                  partySize: { type: 'integer', example: 2 },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Reservation created' },
          400: { description: 'Validation error' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/v1/reservations/{id}': {
      put: {
        tags: ['Reservations'],
        summary: 'Update a reservation date',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['date', 'time'],
                properties: {
                  date: { type: 'string', format: 'date', example: '2025-06-01' },
                  time: { type: 'string', example: '18:00' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Reservation updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
        },
      },
      delete: {
        tags: ['Reservations'],
        summary: 'Delete a reservation',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Reservation deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
        },
      },
    },
    '/api/v1/menus': {
      get: {
        tags: ['Menus'],
        summary: 'Get all menus (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of menus',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    count: { type: 'integer' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' } },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Menus'],
        summary: 'Create a menu item (admin)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'price', 'category', 'venueId'],
                properties: {
                  name: { type: 'string' },
                  price: { type: 'number' },
                  category: { type: 'string' },
                  venueId: { type: 'string' },
                  description: { type: 'string' },
                  imageUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Menu item created' },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/v1/menus/by-venue/{venueId}': {
      get: {
        tags: ['Menus'],
        summary: 'Get menus for a specific venue',
        parameters: [{ name: 'venueId', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: {
            description: 'Menus for venue',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    count: { type: 'integer' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/MenuItem' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/menus/{id}': {
      put: {
        tags: ['Menus'],
        summary: 'Update a menu item (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  price: { type: 'number' },
                  category: { type: 'string' },
                  description: { type: 'string' },
                  imageUrl: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Menu item updated' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
        },
      },
      delete: {
        tags: ['Menus'],
        summary: 'Delete a menu item (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Menu item deleted' },
          401: { description: 'Unauthorized' },
          404: { description: 'Not found' },
        },
      },
    },
    '/api/v1/preorders': {
      get: {
        tags: ['Preorders'],
        summary: 'Get all preorders',
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'List of preorders',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Preorder' } },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },
    '/api/v1/preorders/{venueId}': {
      patch: {
        tags: ['Preorders'],
        summary: 'Confirm / update preorder for a venue',
        parameters: [{ name: 'venueId', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['items'],
                properties: {
                  items: { type: 'array', items: { $ref: '#/components/schemas/PreorderItem' } },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Preorder confirmed' },
        },
      },
    },
    '/api/v1/preorders/{venueId}/items/{menuId}': {
      put: {
        tags: ['Preorders'],
        summary: 'Update quantity of a preorder item',
        parameters: [
          { name: 'venueId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['quantity'],
                properties: { quantity: { type: 'integer', minimum: 1 } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Quantity updated' },
        },
      },
      delete: {
        tags: ['Preorders'],
        summary: 'Remove an item from a preorder',
        parameters: [
          { name: 'venueId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'menuId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Item removed' },
        },
      },
    },
  },
}

export default spec
