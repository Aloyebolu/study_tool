const fs = require('fs');
const path = require('path');

const structure = {
  'api': {
    'auth': {
      'register': {
        'route.ts': `// Handles user registration\n// Already implemented\n`,
      },
      'login': {
        'route.ts': `// Handles user login\n// Already implemented\n`,
      },
    },
    'user': {
      'me': {
        'route.ts': `import { verifyToken } from '@/lib/auth';\n\nexport async function GET(req) {\n  // Return user info from JWT\n  // Use verifyToken and return basic user profile\n}\n`,
      },
    },
    'quiz': {
      'create': {
        'route.ts': `// Create a new quiz (title, description, owner ID)\nexport async function POST(req) {\n  // Validate, save to DB\n}\n`,
      },
      'list': {
        'route.ts': `// List all quizzes available to the user\nexport async function GET() {\n  // Fetch and return quizzes\n}\n`,
      },
    },
    'snippets': {
      'create': {
        'route.ts': `// Save code snippet related to a topic or concept\nexport async function POST(req) {\n  // Insert snippet to DB\n}\n`,
      },
      'get': {
        'route.ts': `// Get snippets based on filters or quiz/topic ID\nexport async function GET(req) {\n  // Query and return snippets\n}\n`,
      },
    },
    'workspace': {
      'save': {
        'route.ts': `// Save workspace state (e.g., notes, code, etc)\nexport async function POST(req) {\n  // Save user's workspace data\n}\n`,
      },
      'load': {
        'route.ts': `// Load user's saved workspace\nexport async function GET(req) {\n  // Return saved workspace\n}\n`,
      },
    },
    'chat': {
      'send': {
        'route.ts': `// Send a chat message\nexport async function POST(req) {\n  // Save message to DB or forward via WebSocket\n}\n`,
      },
      'history': {
        'route.ts': `// Get chat history between users or in a room\nexport async function GET(req) {\n  // Return chat logs\n}\n`,
      },
    },
    'conversation': {
      'start': {
        'route.ts': `// Start a new conversation or session\nexport async function POST(req) {\n  // Create conversation record\n}\n`,
      },
      'reply': {
        'route.ts': `// Add a reply to a conversation\nexport async function POST(req) {\n  // Save reply\n}\n`,
      },
    },
    'notification': {
      'list': {
        'route.ts': `// Fetch all notifications for user\nexport async function GET(req) {\n  // Return notifications from DB\n}\n`,
      },
      'mark-read': {
        'route.ts': `// Mark notifications as read\nexport async function POST(req) {\n  // Update read status\n}\n`,
      },
    },
    'rank': {
      'leaderboard': {
        'route.ts': `// Show top users by score or progress\nexport async function GET(req) {\n  // Return leaderboard data\n}\n`,
      },
    },
  },
};

function createStructure(base, tree) {
  Object.entries(tree).forEach(([name, value]) => {
    const targetPath = path.join(base, name);
    if (typeof value === 'object') {
      if (!fs.existsSync(targetPath)) {
        fs.mkdirSync(targetPath, { recursive: true });
        console.log(`📁 Created folder: ${targetPath}`);
      }
      createStructure(targetPath, value);
    } else {
      if (!fs.existsSync(targetPath)) {
        fs.writeFileSync(targetPath, value);
        console.log(`📄 Created file: ${targetPath}`);
      }
    }
  });
}

createStructure(process.cwd(), structure);

let a = {    "bcrypt": "^6.0.0",
    "dotenv": "^16.4.7",
    "express": "^5.1.0",
    "framer-motion": "^12.0.6",
    "jsonwebtoken": "^9.0.2",
    "lucide-react": "^0.533.0",
    "next": "15.1.2",
    "nodemon": "^3.1.10",
    "pg": "^8.14.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "redis": "^5.5.6",
    "socket.io": "^4.8.1",
    "socket.io-client": "^4.8.1",
    "ws": "^8.18.1"}