import express from 'express';
import cors from 'cors';
import db from './database.js'; // Note the .js extension for local imports in ESM
const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration for production
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
    'https://she-wants.vercel.app' // Add your Vercel URL here
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('Blocked origin:', origin);
            callback(null, true); // Allow all for now, restrict in production
        }
    },
    credentials: true
}));

app.use(express.json());

// --- Auth Routes ---

// Register
app.post('/api/auth/register', (req, res) => {
    const { username, password, secretCode } = req.body;
    const code = secretCode || '1234='; // Default to 1234= if not provided

    // In a real app, hash password here!
    const sql = 'INSERT INTO users (username, password, secret_code) VALUES (?, ?, ?)';
    db.run(sql, [username, password, code], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, username, message: 'User created successfully' });
    });
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.get(sql, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ message: 'Login successful', user: row });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// --- Feature Routes ---

// Get Cycles with statistics
app.get('/api/cycles/:userId', (req, res) => {
    const sql = 'SELECT * FROM cycles WHERE user_id = ? ORDER BY start_date DESC';
    db.all(sql, [req.params.userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Calculate cycle statistics
        let avgCycleLength = null;
        if (rows.length >= 2) {
            let totalDays = 0;
            for (let i = 0; i < rows.length - 1; i++) {
                const current = new Date(rows[i].start_date);
                const next = new Date(rows[i + 1].start_date);
                totalDays += Math.abs((current - next) / (1000 * 60 * 60 * 24));
            }
            avgCycleLength = Math.round(totalDays / (rows.length - 1));
        }

        res.json({
            cycles: rows,
            statistics: {
                totalCycles: rows.length,
                averageCycleLength: avgCycleLength
            }
        });
    });
});

// Add Cycle with validation
app.post('/api/cycles', (req, res) => {
    const { userId, startDate } = req.body;

    if (!userId || !startDate) {
        return res.status(400).json({ error: 'User ID and start date are required' });
    }

    // Check if cycle already exists for this date
    const checkSql = 'SELECT * FROM cycles WHERE user_id = ? AND start_date = ?';
    db.get(checkSql, [userId, startDate], (err, existingCycle) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (existingCycle) {
            return res.status(400).json({ error: 'Cycle already logged for this date' });
        }

        // Insert new cycle
        const sql = 'INSERT INTO cycles (user_id, start_date) VALUES (?, ?)';
        db.run(sql, [userId, startDate], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            console.log(`Cycle logged for user ${userId} on ${startDate}`);
            res.json({
                id: this.lastID,
                message: 'Cycle logged successfully',
                startDate: startDate
            });
        });
    });
});

// Delete a cycle
app.delete('/api/cycles/:cycleId', (req, res) => {
    const { cycleId } = req.params;
    const sql = 'DELETE FROM cycles WHERE id = ?';

    db.run(sql, [cycleId], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Cycle not found' });
        }

        console.log(`Cycle ${cycleId} deleted`);
        res.json({ message: 'Cycle deleted successfully' });
    });
});

// --- Pad Request Routes ---

// Create a pad request
app.post('/api/pad-request', (req, res) => {
    const { userId, username, location } = req.body;

    if (!location || location.lat === 0 || !location.lng) {
        return res.status(400).json({ error: 'Valid location is required for pad requests' });
    }

    const sql = 'INSERT INTO pad_requests (user_id, username, latitude, longitude, status) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [userId, username, location.lat, location.lng, 'active'], function (err) {
        if (err) {
            console.error('Error creating pad request:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Pad request created by ${username} (User ${userId}) at location: ${location.lat}, ${location.lng}`);
        res.json({
            id: this.lastID,
            message: 'Pad request sent! Nearby users will be notified.',
            requestId: this.lastID
        });
    });
});

// Get nearby pad requests (active requests from other users)
app.get('/api/pad-requests/nearby/:userId', (req, res) => {
    const userId = req.params.userId;

    // Get all active requests except from the current user
    const sql = `SELECT id, user_id, username, latitude, longitude, created_at 
                 FROM pad_requests 
                 WHERE status = 'active' AND user_id != ? 
                 ORDER BY created_at DESC`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching pad requests:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ requests: rows });
    });
});

// Get user's own pad requests
app.get('/api/pad-requests/my/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = `SELECT id, latitude, longitude, status, created_at 
                 FROM pad_requests 
                 WHERE user_id = ? 
                 ORDER BY created_at DESC`;

    db.all(sql, [userId], (err, rows) => {
        if (err) {
            console.error('Error fetching user pad requests:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ requests: rows });
    });
});

// Mark a pad request as fulfilled
app.post('/api/pad-request/fulfill', (req, res) => {
    const { requestId, fulfilledBy } = req.body;

    const sql = 'UPDATE pad_requests SET status = ?, fulfilled_by = ? WHERE id = ?';
    db.run(sql, ['fulfilled', fulfilledBy, requestId], function (err) {
        if (err) {
            console.error('Error fulfilling pad request:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Pad request ${requestId} fulfilled by user ${fulfilledBy}`);
        res.json({ message: 'Request marked as fulfilled!' });
    });
});

// --- Community Helpers Routes ---

// Register as a helper
app.post('/api/helpers/register', (req, res) => {
    const { userId, username, bio, location } = req.body;

    const sql = `INSERT INTO community_helpers (user_id, username, bio, latitude, longitude, available) 
                 VALUES (?, ?, ?, ?, ?, 1)
                 ON CONFLICT(user_id) DO UPDATE SET 
                 bio = excluded.bio,
                 latitude = excluded.latitude,
                 longitude = excluded.longitude,
                 available = 1`;

    db.run(sql, [userId, username, bio || '', location?.lat || null, location?.lng || null], function (err) {
        if (err) {
            console.error('Error registering helper:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`${username} (User ${userId}) registered as a community helper`);
        res.json({
            message: 'Successfully registered as a helper!',
            helperId: this.lastID
        });
    });
});

// Get all available helpers
app.get('/api/helpers', (req, res) => {
    const sql = `SELECT id, user_id, username, bio, latitude, longitude, created_at 
                 FROM community_helpers 
                 WHERE available = 1 
                 ORDER BY created_at DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching helpers:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ helpers: rows });
    });
});

// Check if user is a helper
app.get('/api/helpers/status/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = 'SELECT * FROM community_helpers WHERE user_id = ?';
    db.get(sql, [userId], (err, row) => {
        if (err) {
            console.error('Error checking helper status:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({
            isHelper: !!row,
            helperData: row || null
        });
    });
});

// Update helper availability
app.put('/api/helpers/availability', (req, res) => {
    const { userId, available } = req.body;

    const sql = 'UPDATE community_helpers SET available = ? WHERE user_id = ?';
    db.run(sql, [available ? 1 : 0, userId], function (err) {
        if (err) {
            console.error('Error updating availability:', err);
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Helper not found' });
        }

        console.log(`Helper ${userId} availability updated to ${available}`);
        res.json({ message: 'Availability updated successfully' });
    });
});

// Remove helper status
app.delete('/api/helpers/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = 'DELETE FROM community_helpers WHERE user_id = ?';
    db.run(sql, [userId], function (err) {
        if (err) {
            console.error('Error removing helper:', err);
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Helper not found' });
        }

        console.log(`User ${userId} removed from community helpers`);
        res.json({ message: 'Helper status removed successfully' });
    });
});

// --- Sisterhood Posts Routes ---

// Get all posts or filter by category
app.get('/api/posts', (req, res) => {
    const { category } = req.query;

    let sql = `SELECT * FROM sisterhood_posts`;
    let params = [];

    if (category && category !== 'all') {
        sql += ` WHERE category = ?`;
        params.push(category);
    }

    sql += ` ORDER BY created_at DESC`;

    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Error fetching posts:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ posts: rows });
    });
});

// Create a new post
app.post('/api/posts', (req, res) => {
    const { userId, username, category, content, isAnonymous } = req.body;

    if (!content || !category) {
        return res.status(400).json({ error: 'Content and category are required' });
    }

    const displayName = isAnonymous ? 'Anonymous' : username;

    const sql = `INSERT INTO sisterhood_posts (user_id, username, category, content, is_anonymous) 
                 VALUES (?, ?, ?, ?, ?)`;

    db.run(sql, [userId, displayName, category, content, isAnonymous ? 1 : 0], function (err) {
        if (err) {
            console.error('Error creating post:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log(`Post created by ${displayName} in category ${category}`);
        res.json({
            id: this.lastID,
            message: 'Post created successfully'
        });
    });
});

// Get a single post with comments
app.get('/api/posts/:postId', (req, res) => {
    const { postId } = req.params;

    const postSql = 'SELECT * FROM sisterhood_posts WHERE id = ?';
    const commentsSql = 'SELECT * FROM post_comments WHERE post_id = ? ORDER BY created_at ASC';

    db.get(postSql, [postId], (err, post) => {
        if (err) {
            console.error('Error fetching post:', err);
            return res.status(500).json({ error: err.message });
        }

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        db.all(commentsSql, [postId], (err, comments) => {
            if (err) {
                console.error('Error fetching comments:', err);
                return res.status(500).json({ error: err.message });
            }

            res.json({
                post: post,
                comments: comments
            });
        });
    });
});

// Like/Unlike a post
app.post('/api/posts/:postId/like', (req, res) => {
    const { postId } = req.params;
    const { userId } = req.body;

    // Check if already liked
    const checkSql = 'SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?';
    db.get(checkSql, [postId, userId], (err, like) => {
        if (err) {
            console.error('Error checking like:', err);
            return res.status(500).json({ error: err.message });
        }

        if (like) {
            // Unlike
            const deleteSql = 'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?';
            const updateSql = 'UPDATE sisterhood_posts SET likes_count = likes_count - 1 WHERE id = ?';

            db.run(deleteSql, [postId, userId], (err) => {
                if (err) {
                    console.error('Error unliking post:', err);
                    return res.status(500).json({ error: err.message });
                }

                db.run(updateSql, [postId], (err) => {
                    if (err) {
                        console.error('Error updating likes count:', err);
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ liked: false, message: 'Post unliked' });
                });
            });
        } else {
            // Like
            const insertSql = 'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)';
            const updateSql = 'UPDATE sisterhood_posts SET likes_count = likes_count + 1 WHERE id = ?';

            db.run(insertSql, [postId, userId], (err) => {
                if (err) {
                    console.error('Error liking post:', err);
                    return res.status(500).json({ error: err.message });
                }

                db.run(updateSql, [postId], (err) => {
                    if (err) {
                        console.error('Error updating likes count:', err);
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ liked: true, message: 'Post liked' });
                });
            });
        }
    });
});

// Add a comment to a post
app.post('/api/posts/:postId/comment', (req, res) => {
    const { postId } = req.params;
    const { userId, username, comment, isAnonymous } = req.body;

    if (!comment) {
        return res.status(400).json({ error: 'Comment is required' });
    }

    const displayName = isAnonymous ? 'Anonymous' : username;

    const insertSql = `INSERT INTO post_comments (post_id, user_id, username, comment, is_anonymous) 
                       VALUES (?, ?, ?, ?, ?)`;
    const updateSql = 'UPDATE sisterhood_posts SET comments_count = comments_count + 1 WHERE id = ?';

    db.run(insertSql, [postId, userId, displayName, comment, isAnonymous ? 1 : 0], function (err) {
        if (err) {
            console.error('Error adding comment:', err);
            return res.status(500).json({ error: err.message });
        }

        db.run(updateSql, [postId], (err) => {
            if (err) {
                console.error('Error updating comments count:', err);
                return res.status(500).json({ error: err.message });
            }

            console.log(`Comment added to post ${postId} by ${displayName}`);
            res.json({
                id: this.lastID,
                message: 'Comment added successfully'
            });
        });
    });
});

// Check if user liked a post
app.get('/api/posts/:postId/liked/:userId', (req, res) => {
    const { postId, userId } = req.params;

    const sql = 'SELECT * FROM post_likes WHERE post_id = ? AND user_id = ?';
    db.get(sql, [postId, userId], (err, like) => {
        if (err) {
            console.error('Error checking like status:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ liked: !!like });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
