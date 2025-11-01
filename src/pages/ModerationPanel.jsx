import React, { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Card, CardContent, Container, Divider, FormControl, InputLabel, MenuItem,
  Select, Stack, TextField, Typography, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Pagination
} from '@mui/material';
import { toast } from 'react-toastify';
import moderationService from '../services/moderationService';

const severityOptions = [
  { value: '', label: 'All' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const timeOptions = [
  { value: '', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'past_week', label: 'Past Week' },
  { value: 'custom', label: 'Custom' },
];

const ModerationPanel = () => {
  const [filters, setFilters] = useState({ severity: '', location: '', timeRange: '', startDate: '', endDate: '' });
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);

  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteTarget, setNoteTarget] = useState(null);

  const totalPages = useMemo(() => Math.max(1, Math.ceil((data.total || 0) / limit)), [data.total, limit]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await moderationService.getReports({ ...filters, page, limit });
      setData(res);
    } catch (e) {
      toast.error(e?.message || 'Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page]);

  const applyFilters = () => {
    setPage(1);
    load();
  };

  const resetFilters = () => {
    setFilters({ severity: '', location: '', timeRange: '', startDate: '', endDate: '' });
    setPage(1);
    load();
  };

  const onApprove = async (id) => {
    try {
      await moderationService.approve(id);
      toast.success('Report approved');
      load();
    } catch (e) { toast.error(e?.message || 'Failed to approve'); }
  };

  const onReject = async (id) => {
    try {
      await moderationService.reject(id);
      toast.success('Report rejected');
      load();
    } catch (e) { toast.error(e?.message || 'Failed to reject'); }
  };

  const onEscalate = async (id) => {
    try {
      const res = await moderationService.escalate(id);
      toast.success(res?.tweetId ? 'Escalated and posted to TWITTER / X' : (res?.dryRun ? 'Escalated (dry run)' : 'Escalated'));
      load();
    } catch (e) { toast.error(e?.message || 'Failed to escalate'); }
  };

  const openNote = (item) => { setNoteTarget(item); setNoteText(''); setNoteOpen(true); };
  const submitNote = async () => {
    try {
      if (!noteText.trim()) { toast.warn('Enter a note'); return; }
      await moderationService.addNote(noteTarget._id, noteText.trim());
      toast.success('Note added');
      setNoteOpen(false);
      load();
    } catch (e) { toast.error(e?.message || 'Failed to add note'); }
  };

  const exportCsv = () => {
    const rows = data.items || [];
    const headers = ['ID','Status','Severity','Category','Address','Created At','Escalated','Authority'];
    const lines = [headers.join(',')];
    rows.forEach(r => {
      const vals = [r._id, r.status, r.severity, r.category, (r.address||'').replace(/,/g,' '), new Date(r.createdAt).toISOString(), r.escalated, r.authorityHandle||''];
      lines.push(vals.join(','));
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moderation_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>Admin Moderation Panel</Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Severity</InputLabel>
              <Select value={filters.severity} label="Severity" onChange={e => setFilters(f => ({ ...f, severity: e.target.value }))}>
                {severityOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Ward/Zone" value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))} />
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Time Range</InputLabel>
              <Select value={filters.timeRange} label="Time Range" onChange={e => setFilters(f => ({ ...f, timeRange: e.target.value }))}>
                {timeOptions.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
              </Select>
            </FormControl>
            {filters.timeRange === 'custom' && (
              <>
                <TextField type="date" label="Start" InputLabelProps={{ shrink: true }} value={filters.startDate} onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))} />
                <TextField type="date" label="End" InputLabelProps={{ shrink: true }} value={filters.endDate} onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))} />
              </>
            )}
            <Button variant="contained" onClick={applyFilters} disabled={loading}>Apply</Button>
            <Button variant="text" onClick={resetFilters} disabled={loading}>Reset</Button>
            <Box sx={{ flexGrow: 1 }} />
            <Button variant="outlined" onClick={exportCsv}>Export CSV</Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          {data.items.map(item => (
            <Box key={item._id} sx={{ py: 1.5 }}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.category} · Severity {item.severity}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.address}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    <Chip size="small" label={item.status} />
                    {item.escalated && <Chip size="small" color="warning" label={`Escalated ${item.authorityHandle?`@${item.authorityHandle}`:''}`} />}
                  </Stack>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button size="small" variant="contained" color="success" onClick={() => onApprove(item._id)} disabled={loading}>Approve</Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => onReject(item._id)} disabled={loading}>Reject</Button>
                  <Button size="small" variant="contained" onClick={() => onEscalate(item._id)} disabled={loading}>Escalate</Button>
                  <Button size="small" variant="text" onClick={() => openNote(item)} disabled={loading}>Add Note</Button>
                </Stack>
              </Stack>
              <Divider sx={{ my: 1.5 }} />
            </Box>
          ))}
          <Stack direction="row" justifyContent="center" sx={{ mt: 1 }}>
            <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} />
          </Stack>
        </CardContent>
      </Card>

      <Dialog open={noteOpen} onClose={() => setNoteOpen(false)}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <TextField autoFocus multiline minRows={3} fullWidth value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Enter note for this report" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNoteOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitNote}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ModerationPanel;
