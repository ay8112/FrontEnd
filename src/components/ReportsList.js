import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Typography,
  Button,
  TextField,
  MenuItem,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import reportService from '../services/reportService';
import { toast } from 'react-toastify';

const ReportsList = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState({ open: false, report: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reportId: null });

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await reportService.getReports(filters);
        setReports(data);
      } catch (err) {
        setError(err.message || 'Error fetching reports');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setLoading(true);
      await reportService.updateReportStatus(id, newStatus);
      const data = await reportService.getReports(filters);
      setReports(data);
      toast.success('Status updated successfully');
    } catch (err) {
      setError(err.message || 'Error updating status');
      toast.error('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (report) => {
    setEditDialog({ open: true, report: { ...report } });
  };

  const handleEditSave = async () => {
    try {
      setLoading(true);
      const { _id, description, category, severity, address } = editDialog.report;
      await reportService.updateReport(_id, { description, category, severity, address });
      const data = await reportService.getReports(filters);
      setReports(data);
      setEditDialog({ open: false, report: null });
      toast.success('Report updated successfully');
    } catch (err) {
      toast.error('Failed to update report');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteDialog({ open: true, reportId: id });
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await reportService.deleteReport(deleteDialog.reportId);
      const data = await reportService.getReports(filters);
      setReports(data);
      setDeleteDialog({ open: false, reportId: null });
      toast.success('Report deleted successfully');
    } catch (err) {
      toast.error('Failed to delete report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Box>
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            name="status"
            label="Status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All Statuses</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in-progress">In Progress</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            name="category"
            label="Category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="plastic">Plastic</MenuItem>
            <MenuItem value="paper">Paper</MenuItem>
            <MenuItem value="metal">Metal</MenuItem>
            <MenuItem value="glass">Glass</MenuItem>
            <MenuItem value="organic">Organic</MenuItem>
            <MenuItem value="cardboard">Cardboard</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            name="startDate"
            label="Start Date"
            value={filters.startDate}
            onChange={handleFilterChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            type="date"
            name="endDate"
            label="End Date"
            value={filters.endDate}
            onChange={handleFilterChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      {/* Reports Grid */}
      <Grid container spacing={2}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} lg={4} key={report._id}>
            <Card
              sx={{
                borderRadius: 3,
                background: 'rgba(255,255,255,0.6)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.35)',
                boxShadow: '0 0 10px rgba(0,170,255,0.2)',
              }}
            >
              {report.imageUrl && (
                <CardMedia component="img" height="180" image={report.imageUrl} alt="Waste Report" />
              )}
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Chip
                      label={report.status}
                      color={
                        report.status === 'resolved'
                          ? 'success'
                          : report.status === 'in-progress'
                          ? 'warning'
                          : 'error'
                      }
                      size="small"
                    />
                    {report.escalated && (
                      <Chip
                        label="🚨 Escalated"
                        color="warning"
                        size="small"
                        sx={{ 
                          fontWeight: 'bold',
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%, 100%': { opacity: 1 },
                            '50%': { opacity: 0.7 }
                          }
                        }}
                      />
                    )}
                  </Box>
                  <Box>
                    <IconButton size="small" onClick={() => handleEdit(report)} sx={{ mr: 0.5 }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(report._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  {new Date(report.createdAt).toLocaleDateString()}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  {report.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  📍 {report.address}
                </Typography>
                {report.escalated && report.authorityHandle && (
                  <Typography 
                    variant="body2" 
                    color="warning.main" 
                    sx={{ 
                      mt: 0.5, 
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    📢 Escalated to {report.authorityHandle}
                    {report.escalatedAt && (
                      <Typography variant="caption" color="text.secondary" component="span">
                        ({new Date(report.escalatedAt).toLocaleDateString()})
                      </Typography>
                    )}
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  🏷️ {report.category} | ⚠️ Severity: {report.severity}
                </Typography>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  size="small"
                  variant="contained"
                  color="warning"
                  onClick={() => handleStatusUpdate(report._id, 'in-progress')}
                  disabled={report.status === 'resolved'}
                  sx={{ boxShadow: '0 0 8px rgba(255,193,7,0.4)' }}
                >
                  Mark In Progress
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => handleStatusUpdate(report._id, 'resolved')}
                  disabled={report.status === 'resolved'}
                  sx={{ boxShadow: '0 0 8px rgba(76,175,80,0.4)' }}
                >
                  Mark Resolved
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {reports.length === 0 && (
        <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
          No reports found matching the current filters.
        </Typography>
      )}

      {/* Edit Dialog */}
      <Dialog 
        open={editDialog.open} 
        onClose={() => setEditDialog({ open: false, report: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Report</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={editDialog.report?.description || ''}
            onChange={(e) => setEditDialog({
              ...editDialog,
              report: { ...editDialog.report, description: e.target.value }
            })}
            margin="normal"
          />
          <TextField
            fullWidth
            select
            label="Category"
            value={editDialog.report?.category || ''}
            onChange={(e) => setEditDialog({
              ...editDialog,
              report: { ...editDialog.report, category: e.target.value }
            })}
            margin="normal"
          >
            <MenuItem value="plastic">Plastic</MenuItem>
            <MenuItem value="metal">Metal</MenuItem>
            <MenuItem value="cardboard">Cardboard</MenuItem>
            <MenuItem value="glass">Glass</MenuItem>
            <MenuItem value="paper">Paper</MenuItem>
            <MenuItem value="trash">Trash</MenuItem>
          </TextField>
          <Box sx={{ mt: 2 }}>
            <Typography gutterBottom>Severity Level</Typography>
            <Slider
              value={editDialog.report?.severity || 1}
              onChange={(e, newValue) => setEditDialog({
                ...editDialog,
                report: { ...editDialog.report, severity: newValue }
              })}
              min={1}
              max={5}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Box>
          <TextField
            fullWidth
            label="Address"
            value={editDialog.report?.address || ''}
            onChange={(e) => setEditDialog({
              ...editDialog,
              report: { ...editDialog.report, address: e.target.value }
            })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog({ open: false, report: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleEditSave(editDialog.report)}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, reportId: null })}
      >
        <DialogTitle>Delete Report?</DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. Are you sure you want to delete this report?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, reportId: null })}>
            Cancel
          </Button>
          <Button 
            onClick={() => handleDeleteConfirm(deleteDialog.reportId)}
            variant="contained"
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReportsList;