require('dotenv').config();
const mongoose = require('mongoose');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}🔄 ${msg}${colors.reset}`)
};

/**
 * Connect to MongoDB
 */
async function connectDB() {
  try {
    log.step('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
    });
    log.success('Connected to MongoDB Atlas');
  } catch (error) {
    log.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
}

/**
 * Create Groups Collection
 */
async function createGroupsCollection() {
  try {
    log.step('Creating Groups collection...');
    
    const db = mongoose.connection.db;
    
    // Check if collection already exists
    const collections = await db.listCollections({ name: 'groups' }).toArray();
    if (collections.length > 0) {
      log.warning('Groups collection already exists, skipping creation');
      return;
    }

    // Create collection with validation
    await db.createCollection('groups', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['name', 'admin', 'maxMembers', 'contributionAmount', 'frequency', 'payoutOrder', 'duration', 'invitationCode'],
          properties: {
            name: {
              bsonType: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Group name is required and must be 2-100 characters'
            },
            description: {
              bsonType: 'string',
              maxLength: 500,
              description: 'Optional group description'
            },
            admin: {
              bsonType: 'objectId',
              description: 'Reference to admin user ID'
            },
            maxMembers: {
              bsonType: 'int',
              minimum: 2,
              maximum: 50,
              description: 'Maximum number of members allowed'
            },
            members: {
              bsonType: 'array',
              items: {
                bsonType: 'objectId'
              },
              description: 'Array of member user IDs'
            },
            invitationCode: {
              bsonType: 'string',
              minLength: 6,
              maxLength: 6,
              description: '6-character unique invitation code'
            },
            contributionAmount: {
              bsonType: 'number',
              minimum: 100,
              description: 'Contribution amount per cycle'
            },
            frequency: {
              bsonType: 'string',
              enum: ['Weekly', 'Bi-Weekly', 'Monthly'],
              description: 'Contribution frequency'
            },
            payoutOrder: {
              bsonType: 'string',
              enum: ['random', 'firstCome', 'bidding'],
              description: 'Method for determining payout order'
            },
            duration: {
              bsonType: 'int',
              minimum: 1,
              maximum: 24,
              description: 'Duration in months'
            },
            status: {
              bsonType: 'string',
              enum: ['pending', 'active', 'completed', 'cancelled'],
              description: 'Current group status'
            },
            currentTurn: {
              bsonType: 'int',
              minimum: 0,
              description: 'Current turn number'
            },
            totalPool: {
              bsonType: 'number',
              minimum: 0,
              description: 'Total accumulated amount'
            },
            credibilityScore: {
              bsonType: 'number',
              minimum: 0,
              maximum: 100,
              description: 'Group credibility score'
            },
            startDate: {
              bsonType: 'date',
              description: 'Group start date'
            },
            nextContribution: {
              bsonType: 'date',
              description: 'Next contribution due date'
            },
            nextPayout: {
              bsonType: 'date',
              description: 'Next payout date'
            },
            membersList: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['userId', 'name', 'joinDate', 'role', 'status'],
                properties: {
                  userId: { bsonType: 'objectId' },
                  name: { bsonType: 'string' },
                  joinDate: { bsonType: 'date' },
                  role: { 
                    bsonType: 'string',
                    enum: ['Admin', 'Member']
                  },
                  status: { 
                    bsonType: 'string',
                    enum: ['completed', 'current', 'pending', 'missed']
                  },
                  turns: { 
                    bsonType: 'int',
                    minimum: 0
                  },
                  contributionsMade: { 
                    bsonType: 'int',
                    minimum: 0
                  },
                  missedContributions: { 
                    bsonType: 'int',
                    minimum: 0
                  }
                }
              }
            },
            createdAt: {
              bsonType: 'date',
              description: 'Creation timestamp'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Last update timestamp'
            }
          }
        }
      }
    });

    log.success('Groups collection created');

    // Create indexes
    log.step('Creating indexes for Groups collection...');
    const groupsCollection = db.collection('groups');
    
    await groupsCollection.createIndex({ invitationCode: 1 }, { unique: true });
    await groupsCollection.createIndex({ admin: 1 });
    await groupsCollection.createIndex({ members: 1 });
    await groupsCollection.createIndex({ status: 1 });
    await groupsCollection.createIndex({ createdAt: -1 });
    await groupsCollection.createIndex({ nextContribution: 1 });
    await groupsCollection.createIndex({ admin: 1, status: 1 });
    
    log.success('Groups indexes created');

  } catch (error) {
    log.error(`Failed to create Groups collection: ${error.message}`);
    throw error;
  }
}

/**
 * Create Transactions Collection
 */
async function createTransactionsCollection() {
  try {
    log.step('Creating Transactions collection...');
    
    const db = mongoose.connection.db;
    
    // Check if collection already exists
    const collections = await db.listCollections({ name: 'transactions' }).toArray();
    if (collections.length > 0) {
      log.warning('Transactions collection already exists, skipping creation');
      return;
    }

    // Create collection with validation
    await db.createCollection('transactions', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'groupId', 'transactionId', 'type', 'amount', 'status'],
          properties: {
            userId: {
              bsonType: 'objectId',
              description: 'Reference to user ID'
            },
            groupId: {
              bsonType: 'objectId',
              description: 'Reference to group ID'
            },
            transactionId: {
              bsonType: 'string',
              description: 'Unique transaction identifier'
            },
            type: {
              bsonType: 'string',
              enum: ['contribution', 'payout', 'withdrawal'],
              description: 'Type of transaction'
            },
            amount: {
              bsonType: 'number',
              minimum: 0,
              description: 'Transaction amount'
            },
            status: {
              bsonType: 'string',
              enum: ['pending', 'completed', 'failed', 'cancelled'],
              description: 'Transaction status'
            },
            description: {
              bsonType: 'string',
              description: 'Transaction description'
            },
            vendor: {
              bsonType: 'string',
              description: 'Payment vendor/processor'
            },
            paymentMethod: {
              bsonType: 'string',
              enum: ['card', 'bank_transfer', 'wallet'],
              description: 'Payment method used'
            },
            paymentDetails: {
              bsonType: 'object',
              properties: {
                cardLastFour: { bsonType: 'string' },
                cardType: { bsonType: 'string' },
                processorReference: { bsonType: 'string' },
                bankName: { bsonType: 'string' }
              }
            },
            metadata: {
              bsonType: 'object',
              description: 'Additional transaction metadata'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Transaction creation timestamp'
            },
            completedAt: {
              bsonType: 'date',
              description: 'Transaction completion timestamp'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Last update timestamp'
            }
          }
        }
      }
    });

    log.success('Transactions collection created');

    // Create indexes
    log.step('Creating indexes for Transactions collection...');
    const transactionsCollection = db.collection('transactions');
    
    await transactionsCollection.createIndex({ transactionId: 1 }, { unique: true });
    await transactionsCollection.createIndex({ userId: 1 });
    await transactionsCollection.createIndex({ groupId: 1 });
    await transactionsCollection.createIndex({ status: 1 });
    await transactionsCollection.createIndex({ type: 1 });
    await transactionsCollection.createIndex({ createdAt: -1 });
    await transactionsCollection.createIndex({ userId: 1, createdAt: -1 });
    await transactionsCollection.createIndex({ groupId: 1, createdAt: -1 });
    await transactionsCollection.createIndex({ userId: 1, status: 1 });
    
    log.success('Transactions indexes created');

  } catch (error) {
    log.error(`Failed to create Transactions collection: ${error.message}`);
    throw error;
  }
}

/**
 * Create Wallets Collection
 */
async function createWalletsCollection() {
  try {
    log.step('Creating Wallets collection...');
    
    const db = mongoose.connection.db;
    
    // Check if collection already exists
    const collections = await db.listCollections({ name: 'wallets' }).toArray();
    if (collections.length > 0) {
      log.warning('Wallets collection already exists, skipping creation');
      return;
    }

    // Create collection with validation
    await db.createCollection('wallets', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'totalBalance', 'availableBalance', 'lockedBalance'],
          properties: {
            userId: {
              bsonType: 'objectId',
              description: 'Reference to user ID (unique)'
            },
            totalBalance: {
              bsonType: 'number',
              minimum: 0,
              description: 'Total wallet balance'
            },
            availableBalance: {
              bsonType: 'number',
              minimum: 0,
              description: 'Available balance for withdrawal'
            },
            lockedBalance: {
              bsonType: 'number',
              minimum: 0,
              description: 'Balance locked in groups'
            },
            totalPayouts: {
              bsonType: 'number',
              minimum: 0,
              description: 'Total received payouts'
            },
            totalContributions: {
              bsonType: 'number',
              minimum: 0,
              description: 'Total contributions made'
            },
            totalWithdrawals: {
              bsonType: 'number',
              minimum: 0,
              description: 'Total withdrawals'
            },
            autoWithdrawal: {
              bsonType: 'object',
              properties: {
                enabled: {
                  bsonType: 'bool',
                  description: 'Auto-withdrawal enabled flag'
                },
                bankAccount: {
                  bsonType: 'string',
                  description: 'Bank account for auto-withdrawal'
                },
                percentage: {
                  bsonType: 'int',
                  minimum: 10,
                  maximum: 100,
                  description: 'Percentage to auto-withdraw'
                },
                minAmount: {
                  bsonType: 'number',
                  minimum: 100,
                  description: 'Minimum amount to trigger auto-withdrawal'
                }
              }
            },
            linkedBankAccounts: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                properties: {
                  accountNumber: { bsonType: 'string' },
                  accountName: { bsonType: 'string' },
                  bankName: { bsonType: 'string' },
                  bankCode: { bsonType: 'string' },
                  isPrimary: { bsonType: 'bool' },
                  isVerified: { bsonType: 'bool' },
                  addedAt: { bsonType: 'date' }
                }
              }
            },
            createdAt: {
              bsonType: 'date',
              description: 'Wallet creation timestamp'
            },
            updatedAt: {
              bsonType: 'date',
              description: 'Last update timestamp'
            }
          }
        }
      }
    });

    log.success('Wallets collection created');

    // Create indexes
    log.step('Creating indexes for Wallets collection...');
    const walletsCollection = db.collection('wallets');
    
    await walletsCollection.createIndex({ userId: 1 }, { unique: true });
    await walletsCollection.createIndex({ createdAt: -1 });
    
    log.success('Wallets indexes created');

  } catch (error) {
    log.error(`Failed to create Wallets collection: ${error.message}`);
    throw error;
  }
}

/**
 * Create Notifications Collection (Bonus)
 */
async function createNotificationsCollection() {
  try {
    log.step('Creating Notifications collection...');
    
    const db = mongoose.connection.db;
    
    // Check if collection already exists
    const collections = await db.listCollections({ name: 'notifications' }).toArray();
    if (collections.length > 0) {
      log.warning('Notifications collection already exists, skipping creation');
      return;
    }

    // Create collection with validation
    await db.createCollection('notifications', {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['userId', 'type', 'title', 'message'],
          properties: {
            userId: {
              bsonType: 'objectId',
              description: 'Reference to user ID'
            },
            type: {
              bsonType: 'string',
              enum: ['contribution', 'payout', 'groupInvite', 'groupUpdate', 'payment', 'system'],
              description: 'Notification type'
            },
            title: {
              bsonType: 'string',
              description: 'Notification title'
            },
            message: {
              bsonType: 'string',
              description: 'Notification message'
            },
            isRead: {
              bsonType: 'bool',
              description: 'Read status'
            },
            relatedEntity: {
              bsonType: 'object',
              properties: {
                entityType: { 
                  bsonType: 'string',
                  enum: ['group', 'transaction', 'user']
                },
                entityId: { bsonType: 'objectId' }
              }
            },
            actionUrl: {
              bsonType: 'string',
              description: 'URL for notification action'
            },
            createdAt: {
              bsonType: 'date',
              description: 'Creation timestamp'
            },
            readAt: {
              bsonType: 'date',
              description: 'Read timestamp'
            }
          }
        }
      }
    });

    log.success('Notifications collection created');

    // Create indexes
    log.step('Creating indexes for Notifications collection...');
    const notificationsCollection = db.collection('notifications');
    
    await notificationsCollection.createIndex({ userId: 1 });
    await notificationsCollection.createIndex({ userId: 1, isRead: 1 });
    await notificationsCollection.createIndex({ createdAt: -1 });
    await notificationsCollection.createIndex({ userId: 1, createdAt: -1 });
    
    log.success('Notifications indexes created');

  } catch (error) {
    log.error(`Failed to create Notifications collection: ${error.message}`);
    throw error;
  }
}

/**
 * Verify Users Collection Indexes
 */
async function verifyUsersIndexes() {
  try {
    log.step('Verifying Users collection indexes...');
    
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Get existing indexes
    const existingIndexes = await usersCollection.indexes();
    const indexNames = existingIndexes.map(idx => idx.name);
    
    log.info(`Found ${existingIndexes.length} existing indexes on Users collection`);
    
    // Create missing indexes if needed
    const requiredIndexes = [
      { key: { email: 1, isActive: 1 }, name: 'email_1_isActive_1' },
      { key: { phoneNumber: 1, isActive: 1 }, name: 'phoneNumber_1_isActive_1' },
      { key: { isVerified: 1, isActive: 1 }, name: 'isVerified_1_isActive_1' },
      { key: { createdAt: -1 }, name: 'createdAt_-1' },
      { key: { referralCode: 1 }, name: 'referralCode_1', unique: true, sparse: true }
    ];
    
    for (const indexSpec of requiredIndexes) {
      if (!indexNames.includes(indexSpec.name)) {
        log.step(`Creating missing index: ${indexSpec.name}`);
        const { key, name, ...options } = indexSpec;
        await usersCollection.createIndex(key, { name, ...options });
        log.success(`Created index: ${name}`);
      }
    }
    
    log.success('Users collection indexes verified');

  } catch (error) {
    log.error(`Failed to verify Users indexes: ${error.message}`);
    throw error;
  }
}

/**
 * Display Migration Summary
 */
async function displaySummary() {
  try {
    log.step('Generating migration summary...');
    
    const db = mongoose.connection.db;
    
    console.log('\n' + '='.repeat(60));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(60) + '\n');
    
    const collections = ['users', 'groups', 'transactions', 'wallets', 'notifications'];
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      const indexes = await collection.indexes();
      
      console.log(`${colors.cyan}${collectionName.toUpperCase()}${colors.reset}`);
      console.log(`  Documents: ${count}`);
      console.log(`  Indexes: ${indexes.length}`);
      console.log(`  Index Names: ${indexes.map(idx => idx.name).join(', ')}`);
      console.log('');
    }
    
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    log.error(`Failed to generate summary: ${error.message}`);
  }
}

/**
 * Main Migration Function
 */
async function runMigration() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 AJOSAVE DATABASE MIGRATION');
  console.log('='.repeat(60) + '\n');
  
  try {
    // Connect to database
    await connectDB();
    
    // Run migrations
    await verifyUsersIndexes();
    await createGroupsCollection();
    await createTransactionsCollection();
    await createWalletsCollection();
    await createNotificationsCollection();
    
    // Display summary
    await displaySummary();
    
    log.success('Migration completed successfully! 🎉');
    
    console.log('\n' + '='.repeat(60));
    console.log('📝 NEXT STEPS:');
    console.log('='.repeat(60));
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Test via frontend registration and group creation');
    console.log('3. Monitor MongoDB Atlas for data creation');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    log.error('Migration failed!');
    console.error(error);
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    log.info('Database connection closed');
  }
}

// Run migration
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };