import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Chip, Link, Stack, Divider, Skeleton, Tooltip, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControlLabel, Checkbox } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import reportService from '../services/reportService';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const TweetCard = ({ item, onEdited, onDeleted }) => {
  const { user } = useAuth();
  const posted = Boolean(item.escalationTweetId);
  const escalatedDate = item.escalatedAt ? new Date(item.escalatedAt) : null;
  const relativeAge = escalatedDate ? formatDistanceToNow(escalatedDate, { addSuffix: true }) : '-';
  const tweetUrl = posted ? `https://twitter.com/i/web/status/${item.escalationTweetId}` : null;
  const isOwnerOrAdmin = user?.role === 'admin' || String(item.submittedBy) === String(user?.id);

  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [editText, setEditText] = React.useState(item.escalationTweetText || '');
  const [repostToTwitter, setRepostToTwitter] = React.useState(true);

  const handleSaveEdit = async () => {
    try {
      if (!editText || !editText.trim()) {
        toast.error('Please enter text');
        return;
      }
      await reportService.updateEscalation(item._id, { text: editText.trim(), repost: repostToTwitter });
      toast.success(repostToTwitter ? 'Post updated and reposted to Twitter' : 'Post text updated');
      setEditOpen(false);
      onEdited?.();
    } catch (e) {
      toast.error(e?.error || e?.message || 'Failed to update');
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await reportService.deleteEscalation(item._id);
      toast.success('Post deleted');
      setDeleteOpen(false);
      onDeleted?.();
    } catch (e) {
      toast.error(e?.error || e?.message || 'Failed to delete');
    }
  };
  return (
    <Card sx={{ mb: 2, borderRadius: 2, background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Stack direction="row" spacing={1} alignItems="center">
            <TwitterIcon color={posted ? 'primary' : 'disabled'} />
            <Chip size="small" label={posted ? 'TWITTER / X post' : 'TWITTER / X (logged only)'} color={posted ? 'primary' : 'warning'} />
            {item.authorityHandle && (
              <Chip size="small" label={`Escalated to ${item.authorityHandle}`} />
            )}
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Tooltip title={escalatedDate ? escalatedDate.toLocaleString() : ''}>
              <Typography variant="caption" color="text.secondary">{relativeAge}</Typography>
            </Tooltip>
            {isOwnerOrAdmin && (
              <>
                <IconButton size="small" aria-label="Edit post" onClick={() => setEditOpen(true)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" aria-label="Delete post" onClick={() => setDeleteOpen(true)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Stack>
        </Stack>

        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
          {item.escalationTweetText || '(Tweet text unavailable)'}
        </Typography>

        <Divider sx={{ my: 1.5 }} />
        <Typography variant="body2" color="text.secondary">
          📍 {item.address} | 🏷️ {item.category} | ⚠️ Severity: {item.severity}
        </Typography>

        {tweetUrl && (
          <Box sx={{ mt: 1 }}>
            <Link href={tweetUrl} target="_blank" rel="noopener noreferrer">
              View on Twitter
            </Link>
          </Box>
        )}

        {/* Edit dialog */}
        <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit Social Post</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Post text"
              fullWidth
              multiline
              minRows={3}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              inputProps={{ maxLength: 280 }}
              helperText={`${editText.length}/280`}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={repostToTwitter}
                  onChange={(e) => setRepostToTwitter(e.target.checked)}
                />
              }
              label="Repost to Twitter / X"
              sx={{ mt: 2 }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {repostToTwitter 
                ? 'The existing tweet will be deleted and a new one posted with updated text.' 
                : 'Only the stored text will be updated. No changes to Twitter.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSaveEdit}>Save</Button>
          </DialogActions>
        </Dialog>

        {/* Delete confirmation dialog */}
        <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle>Delete Social Post?</DialogTitle>
          <DialogContent>
            <Typography>
              This will delete the tweet from Twitter / X (if posted) and remove the escalation information from the system.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleConfirmDelete}>Delete</Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const TwitterUpdates = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getEscalations(100);
      setItems(data);
    } catch (e) {
      setError(e?.error || e?.message || 'Failed to load updates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reportService.getEscalations(100);
        setItems(data);
      } catch (e) {
        setError(e?.error || e?.message || 'Failed to load updates');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Social Media Updates</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Here you can see whether a TWITTER / X post was made for escalated reports and the exact message content.
      </Typography>

      {loading && (
        <>
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
          ))}
        </>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}

      {!loading && !error && items.length === 0 && (
        <Typography>No social media posts yet.</Typography>
      )}

      {!loading && !error && items.map(item => (
        <TweetCard key={item._id} item={item} onEdited={load} onDeleted={load} />
      ))}
    </Box>
  );
};

export default TwitterUpdates;
