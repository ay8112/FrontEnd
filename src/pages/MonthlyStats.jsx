import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  CalendarToday,
  ExpandMore,
  Assessment
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { format } from 'date-fns';

const MonthlyStats = () => {
  const [loading, setLoading] = useState(true);
  const [yearlyData, setYearlyData] = useState([]);
  const [currentStats, setCurrentStats] = useState({ currentMonth: 0, currentYear: 0, total: 0 });

  useEffect(() => {
    fetchMonthlyStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMonthlyStats = async () => {
    try {
      setLoading(true);
      
      // Fetch resolved reports from backend
      const response = await api.get('/api/admin/reports/resolved-stats');
      
      if (response.data.success) {
        processStatsData(response.data.reports);
      }
    } catch (err) {
      console.error('Error fetching monthly stats:', err);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const processStatsData = (reports) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Group reports by year and month
    const yearMap = {};
    const monthMap = {};

    reports.forEach((report) => {
      const resolvedDate = new Date(report.resolvedAt || report.updatedAt);
      const year = resolvedDate.getFullYear();
      const month = resolvedDate.getMonth();
      const monthKey = format(resolvedDate, 'yyyy-MM');

      // Year grouping
      if (!yearMap[year]) {
        yearMap[year] = [];
      }
      yearMap[year].push(report);

      // Month grouping
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = {
          year,
          month,
          monthName: format(resolvedDate, 'MMMM yyyy'),
          reports: []
        };
      }
      monthMap[monthKey].reports.push(report);
    });

    // Convert to arrays and sort
    const sortedMonths = Object.values(monthMap).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });

    const sortedYears = Object.keys(yearMap)
      .sort((a, b) => b - a)
      .map((year) => ({
        year: parseInt(year),
        count: yearMap[year].length,
        months: sortedMonths.filter(m => m.year === parseInt(year))
      }));

    // Calculate current stats
    const currentMonthCount = sortedMonths.find(
      m => m.year === currentYear && m.month === currentMonth
    )?.reports.length || 0;

    const currentYearCount = yearMap[currentYear]?.length || 0;
    const totalCount = reports.length;

    setYearlyData(sortedYears);
    setCurrentStats({
      currentMonth: currentMonthCount,
      currentYear: currentYearCount,
      total: totalCount
    });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  const currentDate = new Date();
  const currentMonthName = format(currentDate, 'MMMM yyyy');
  const currentYearName = format(currentDate, 'yyyy');

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
            📊 Monthly Problem Resolution Statistics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track resolved reports month-wise and year-wise with automatic rollup
          </Typography>
        </Box>

        {/* Current Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ mr: 1 }} />
                  <Typography variant="h6">Current Month</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {currentStats.currentMonth}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  {currentMonthName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUp sx={{ mr: 1 }} />
                  <Typography variant="h6">Current Year</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {currentStats.currentYear}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  Year {currentYearName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircle sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Resolved</Typography>
                </Box>
                <Typography variant="h3" fontWeight="bold">
                  {currentStats.total}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  All Time
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* Yearly Breakdown with Month Details */}
        <Box>
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
            📅 Year-wise Breakdown
          </Typography>

          {yearlyData.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Assessment sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No resolved reports yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Statistics will appear once reports are marked as resolved
              </Typography>
            </Box>
          ) : (
            yearlyData.map((yearData) => (
              <Accordion key={yearData.year} defaultExpanded={yearData.year === currentDate.getFullYear()}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{ 
                    bgcolor: 'primary.light', 
                    color: 'primary.contrastText',
                    '&:hover': { bgcolor: 'primary.main' }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      📆 Year {yearData.year}
                    </Typography>
                    <Chip 
                      label={`${yearData.count} Problems Solved`} 
                      color="success" 
                      sx={{ fontWeight: 'bold' }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell><strong>Month</strong></TableCell>
                          <TableCell align="right"><strong>Problems Solved</strong></TableCell>
                          <TableCell align="right"><strong>Status</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {yearData.months.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} align="center">
                              <Typography color="text.secondary">No data for this year</Typography>
                            </TableCell>
                          </TableRow>
                        ) : (
                          yearData.months.map((monthData) => {
                            const isCurrentMonth = 
                              monthData.year === currentDate.getFullYear() && 
                              monthData.month === currentDate.getMonth();

                            return (
                              <TableRow 
                                key={`${monthData.year}-${monthData.month}`}
                                sx={{ 
                                  bgcolor: isCurrentMonth ? 'action.hover' : 'inherit',
                                  '&:hover': { bgcolor: 'action.selected' }
                                }}
                              >
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <CalendarToday sx={{ mr: 1, fontSize: 18, color: 'primary.main' }} />
                                    <Typography fontWeight={isCurrentMonth ? 'bold' : 'normal'}>
                                      {monthData.monthName}
                                    </Typography>
                                    {isCurrentMonth && (
                                      <Chip label="Current" size="small" color="primary" sx={{ ml: 1 }} />
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell align="right">
                                  <Chip 
                                    label={monthData.reports.length} 
                                    color="success" 
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell align="right">
                                  <CheckCircle sx={{ color: 'success.main' }} />
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>

        {/* Footer Note */}
        <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="body2" color="info.contrastText">
            📝 <strong>Note:</strong> Once a year completes (all 12 months), it will be automatically rolled up into a year block. 
            New months will continue to be tracked in the current year section.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default MonthlyStats;
