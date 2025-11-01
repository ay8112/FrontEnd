import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Delete, Email, Person } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const getErrMsg = (err) =>
  err?.response?.data?.error ||
  err?.response?.data?.message ||
  err?.message ||
  'Request failed';

const ManageAdmins = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ email: '', username: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/admin-auth/list');
      setAdmins(response.data.admins || []);
    } catch (err) {
      toast.error(getErrMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post('/api/admin-auth/create', formData);
      toast.success(response.data.message || 'Admin created successfully');
      
      // Show temp password in dev mode
      if (response.data.dryRun && response.data.tempPassword) {
        console.log('📧 [DEV MODE] Temporary Password:', response.data.tempPassword);
        toast.info(`DEV MODE: Password is ${response.data.tempPassword}`);
      }
      
      setDialogOpen(false);
      setFormData({ email: '', username: '' });
      fetchAdmins();
    } catch (err) {
      toast.error(getErrMsg(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    if (adminId === user.id) {
      toast.error('You cannot delete your own account');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete admin: ${adminEmail}?`)) {
      return;
    }

    try {
      await api.delete(`/api/admin-auth/${adminId}`);
      toast.success('Admin deleted successfully');
      fetchAdmins();
    } catch (err) {
      toast.error(getErrMsg(err));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
              👥 Manage Admins
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create and manage administrator accounts
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setDialogOpen(true)}
            size="large"
          >
            Add New Admin
          </Button>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }}>
          <strong>Security Notice:</strong> New admins will receive an email with temporary credentials. 
          They must change their password on first login.
        </Alert>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Username</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Created</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="right"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {admins.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">No admins found</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  admins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1, color: 'primary.main' }} />
                          {admin.username}
                          {admin._id === user.id && (
                            <Chip label="You" color="primary" size="small" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Email sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                          {admin.email}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {format(new Date(admin.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Chip label="Active" color="success" size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                          disabled={admin._id === user.id}
                          title={admin._id === user.id ? 'Cannot delete yourself' : 'Delete admin'}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total Admins: <strong>{admins.length}</strong>
          </Typography>
        </Box>
      </Paper>

      {/* Create Admin Dialog */}
      <Dialog open={dialogOpen} onClose={() => !submitting && setDialogOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleCreateAdmin}>
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              ➕ Add New Admin
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Alert severity="warning" sx={{ mb: 2 }}>
              The new admin will receive an email with temporary login credentials.
            </Alert>
            <TextField
              fullWidth
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              margin="normal"
              autoFocus
              InputProps={{
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              margin="normal"
              InputProps={{
                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Admin'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default ManageAdmins;
