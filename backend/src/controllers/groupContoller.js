const Group = require('../models/Groups');
const User = require('../models/Users');
const {
  AppError,
  ValidationError,
  NotFoundError,
  asyncErrorHandler
} = require('../middlewares/errorHandler');

/**
 * Create Group Handler
 * 
 * @route   POST /api/groups
 * @desc    Create a new savings group
 * @access  Private
 */
const createGroup = asyncErrorHandler(async (req, res) => {
  const {
    name,
    description,
    maxMembers,
    duration,
    contributionAmount,
    frequency,
    payoutOrder,
    emails
  } = req.body;

  const userId = req.user._id;
  const userName = `${req.user.firstName} ${req.user.lastName}`;

  console.log(`🔐 Creating group: ${name} by user: ${userId}`);

  try {
    // Generate unique invitation code
    const invitationCode = await Group.generateInvitationCode();

    // Calculate dates
    const startDate = new Date();
    
    // Create group
    const group = new Group({
      name: name.trim(),
      description: description ? description.trim() : '',
      admin: userId,
      maxMembers: parseInt(maxMembers),
      duration: parseInt(duration),
      contributionAmount: parseFloat(contributionAmount),
      frequency,
      payoutOrder,
      invitationCode,
      members: [userId],
      startDate,
      status: 'pending',
      currentTurn: 0,
      totalPool: 0,
      credibilityScore: 100
    });

    // Calculate next contribution date
    group.nextContribution = group.calculateNextContribution();
    group.nextPayout = group.nextContribution;

    // Add admin to members list
    group.membersList.push({
      userId,
      name: userName,
      joinDate: startDate,
      role: 'Admin',
      status: 'pending',
      turns: 0,
      contributionsMade: 0,
      missedContributions: 0
    });

    // Save group
    await group.save();

    console.log(`✅ Group created successfully: ${group._id} with code: ${invitationCode}`);

    // TODO: Send invitations to emails if provided
    if (emails && emails.trim()) {
      const emailList = emails.split(',').map(e => e.trim());
      console.log(`📧 Sending invitations to: ${emailList.join(', ')}`);
      // Implement email sending logic here
    }

    res.status(201).json({
      success: true,
      message: 'Group created successfully',
      data: {
        group,
        invitationCode
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Group creation failed:`, error.message);
    throw error;
  }
});

/**
 * Get User's Groups
 * 
 * @route   GET /api/groups
 * @desc    Get all groups user is a member of
 * @access  Private
 */
const getUserGroups = asyncErrorHandler(async (req, res) => {
  const userId = req.user._id;

  console.log(`📊 Getting groups for user: ${userId}`);

  try {
    // Find groups where user is a member
    const groups = await Group.find({
      members: userId
    })
    .sort({ createdAt: -1 })
    .populate('admin', 'firstName lastName email');

    console.log(`✅ Found ${groups.length} groups for user: ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Groups retrieved successfully',
      data: {
        groups,
        count: groups.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to get groups:`, error.message);
    throw error;
  }
});

/**
 * Get Group by ID
 * 
 * @route   GET /api/groups/:id
 * @desc    Get detailed information about a specific group
 * @access  Private
 */
const getGroupById = asyncErrorHandler(async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user._id;

  console.log(`🔍 Getting group: ${groupId} for user: ${userId}`);

  try {
    const group = await Group.findById(groupId)
      .populate('admin', 'firstName lastName email phoneNumber')
      .populate('members', 'firstName lastName email');

    if (!group) {
      throw new NotFoundError('Group not found');
    }

    // Check if user is a member
    const isMember = group.members.some(
      member => member._id.toString() === userId.toString()
    );

    if (!isMember) {
      throw new ValidationError('You are not a member of this group');
    }

    console.log(`✅ Group found: ${group.name}`);

    res.status(200).json({
      success: true,
      message: 'Group retrieved successfully',
      data: { group },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to get group:`, error.message);
    throw error;
  }
});

/**
 * Find Group by Invitation Code
 * 
 * @route   GET /api/groups/find/:code
 * @desc    Find group by invitation code (for joining)
 * @access  Private
 */
const findGroupByCode = asyncErrorHandler(async (req, res) => {
  const invitationCode = req.params.code.toUpperCase();
  const userId = req.user._id;

  console.log(`🔍 Finding group with code: ${invitationCode}`);

  try {
    const group = await Group.findOne({ invitationCode })
      .populate('admin', 'firstName lastName')
      .populate('members', 'firstName lastName');

    if (!group) {
      throw new NotFoundError('Invalid invitation code. Group not found');
    }

    // Check if user is already a member
    const isAlreadyMember = group.members.some(
      member => member._id.toString() === userId.toString()
    );

    if (isAlreadyMember) {
      throw new ValidationError('You are already a member of this group');
    }

    // Check if group is full
    if (group.isFull()) {
      throw new ValidationError('This group is full and cannot accept new members');
    }

    console.log(`✅ Group found: ${group.name}`);

    res.status(200).json({
      success: true,
      message: 'Group found',
      data: { group },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to find group:`, error.message);
    throw error;
  }
});

/**
 * Join Group
 * 
 * @route   POST /api/groups/:id/join
 * @desc    Join an existing group using invitation code
 * @access  Private
 */
const joinGroup = asyncErrorHandler(async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user._id;
  const userName = `${req.user.firstName} ${req.user.lastName}`;

  console.log(`👥 User ${userId} joining group: ${groupId}`);

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new NotFoundError('Group not found');
    }

    // Use the model method to add member
    await group.addMember(userId, userName);

    console.log(`✅ User ${userId} joined group: ${group.name}`);

    res.status(200).json({
      success: true,
      message: 'Successfully joined group',
      data: { group },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to join group:`, error.message);
    throw error;
  }
});

/**
 * Update Group Status
 * 
 * @route   PUT /api/groups/:id/status
 * @desc    Update group status (admin only)
 * @access  Private
 */
const updateGroupStatus = asyncErrorHandler(async (req, res) => {
  const groupId = req.params.id;
  const userId = req.user._id;
  const { status } = req.body;

  console.log(`🔄 Updating group ${groupId} status to: ${status}`);

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new NotFoundError('Group not found');
    }

    // Check if user is admin
    if (group.admin.toString() !== userId.toString()) {
      throw new ValidationError('Only group admin can update status');
    }

    // Validate status transition
    const validStatuses = ['pending', 'active', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new ValidationError('Invalid status');
    }

    group.status = status;
    await group.save();

    console.log(`✅ Group status updated to: ${status}`);

    res.status(200).json({
      success: true,
      message: 'Group status updated successfully',
      data: { group },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to update group status:`, error.message);
    throw error;
  }
});

/**
 * Get Group Statistics
 * 
 * @route   GET /api/groups/:id/stats
 * @desc    Get statistics for a specific group
 * @access  Private
 */
const getGroupStats = asyncErrorHandler(async (req, res) => {
  const groupId = req.params.id;

  console.log(`📊 Getting stats for group: ${groupId}`);

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      throw new NotFoundError('Group not found');
    }

    // Calculate statistics
    const totalContributions = group.membersList.reduce(
      (sum, member) => sum + member.contributionsMade,
      0
    );

    const totalMissed = group.membersList.reduce(
      (sum, member) => sum + member.missedContributions,
      0
    );

    const completedTurns = group.membersList.filter(
      m => m.status === 'completed'
    ).length;

    const stats = {
      totalMembers: group.members.length,
      maxMembers: group.maxMembers,
      totalPool: group.totalPool,
      totalContributions,
      totalMissed,
      completedTurns,
      currentTurn: group.currentTurn,
      status: group.status,
      credibilityScore: group.credibilityScore,
      progress: (completedTurns / group.maxMembers) * 100
    };

    res.status(200).json({
      success: true,
      message: 'Group statistics retrieved successfully',
      data: { stats },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error(`❌ Failed to get group stats:`, error.message);
    throw error;
  }
});

// Export all controller functions
module.exports = {
  createGroup,
  getUserGroups,
  getGroupById,
  findGroupByCode,
  joinGroup,
  updateGroupStatus,
  getGroupStats
};