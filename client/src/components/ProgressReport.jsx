import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { parentAPI } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ProgressReport.css';

const ProgressReport = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [childModeProgress, setChildModeProgress] = useState(null);
  const [playTogetherProgress, setPlayTogetherProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      
      const childResponse = await parentAPI.getChildById(childId);
      setChild(childResponse.child);

      
      const childModeData = localStorage.getItem(`childMode_${childId}`);
      console.log('Child Mode Data from localStorage:', childModeData);
      if (childModeData) {
        const parsed = JSON.parse(childModeData);
        console.log('Parsed Child Mode Progress:', parsed);
        setChildModeProgress(parsed);
      } else {
        console.log('No Child Mode data found in localStorage');
      }

      
      const playTogetherData = localStorage.getItem(`playTogether_${childId}`);
      console.log('Play Together Data from localStorage:', playTogetherData);
      if (playTogetherData) {
        setPlayTogetherProgress(JSON.parse(playTogetherData));
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text('Progress Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Child: ${child?.name}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 36, { align: 'center' });

    let yPos = 50;

    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.text('Child Information', 14, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    const childInfo = [
      ['Name:', child?.name || 'N/A'],
      ['Age:', child?.age ? `${child.age} years` : 'N/A'],
      ['Gender:', child?.sex || 'N/A'],
      ['Learning Level:', child?.learningLevel || 'beginner']
    ];

    childInfo.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(value, 60, yPos);
      yPos += 8;
    });

    yPos += 5;

    
    doc.setFillColor(240, 245, 255);
    doc.rect(14, yPos, pageWidth - 28, 10, 'F');
    doc.setFontSize(14);
    doc.setTextColor(102, 126, 234);
    doc.text('Child Mode Progress', 20, yPos + 7);
    yPos += 18;

    if (childModeProgress) {
      const childModeStats = [
        ['Total Points:', childModeProgress.totalPoints || 0],
        ['Activities Completed:', childModeProgress.activitiesCompleted || 0],
        ['Games Played:', childModeProgress.gamesPlayed || 0],
        ['Time Spent:', `${childModeProgress.totalTimeSpent || 0} minutes`],
        ['Last Active:', childModeProgress.lastActive ? new Date(childModeProgress.lastActive).toLocaleDateString() : 'Never']
      ];

      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      childModeStats.forEach(([label, value]) => {
        doc.setFont(undefined, 'bold');
        doc.text(label, 20, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(String(value), 70, yPos);
        yPos += 8;
      });
    } else {
      doc.setFontSize(11);
      doc.setTextColor(153, 153, 153);
      doc.text('No Child Mode data available', 20, yPos);
    }

    yPos += 10;

    
    doc.setFillColor(255, 245, 238);
    doc.rect(14, yPos, pageWidth - 28, 10, 'F');
    doc.setFontSize(14);
    doc.setTextColor(252, 182, 159);
    doc.text('Play Together Progress', 20, yPos + 7);
    yPos += 18;

    if (playTogetherProgress) {
      const playTogetherStats = [
        ['Games Played Together:', playTogetherProgress.gamesPlayedTogether || 0],
        ['Total Time Spent:', `${playTogetherProgress.totalTimeSpent || 0} minutes`],
        ['Family Points:', playTogetherProgress.familyPoints || 0],
        ['Team Stars:', playTogetherProgress.teamStars || 0],
        ['Last Played Together:', playTogetherProgress.lastPlayed ? new Date(playTogetherProgress.lastPlayed).toLocaleDateString() : 'Never']
      ];

      doc.setFontSize(11);
      doc.setTextColor(51, 51, 51);
      playTogetherStats.forEach(([label, value]) => {
        doc.setFont(undefined, 'bold');
        doc.text(label, 20, yPos);
        doc.setFont(undefined, 'normal');
        doc.text(String(value), 80, yPos);
        yPos += 8;
      });

      yPos += 5;

      
      if (playTogetherProgress.teamworkBadges && playTogetherProgress.teamworkBadges.length > 0) {
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Teamwork Badges Earned:', 20, yPos);
        yPos += 8;
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(11);
        playTogetherProgress.teamworkBadges.forEach((badge, index) => {
          const badgeName = typeof badge === 'object' ? badge.name : badge;
          doc.text(`${index + 1}. ${badgeName}`, 25, yPos);
          yPos += 7;
        });
      }
    } else {
      doc.setFontSize(11);
      doc.setTextColor(153, 153, 153);
      doc.text('No Play Together data available', 20, yPos);
    }

    yPos += 10;

    
    doc.setFillColor(240, 255, 240);
    doc.rect(14, yPos, pageWidth - 28, 10, 'F');
    doc.setFontSize(14);
    doc.setTextColor(46, 204, 113);
    doc.text('Performance Summary', 20, yPos + 7);
    yPos += 18;

    const totalPoints = (childModeProgress?.totalPoints || 0) + (playTogetherProgress?.familyPoints || 0);
    const totalActivities = (childModeProgress?.activitiesCompleted || 0) + (playTogetherProgress?.gamesPlayedTogether || 0);
    const totalTime = (childModeProgress?.totalTimeSpent || 0) + (playTogetherProgress?.totalTimeSpent || 0);

    const summaryStats = [
      ['Total Points Earned:', totalPoints],
      ['Total Activities/Games:', totalActivities],
      ['Total Time Invested:', `${totalTime} minutes`],
      ['Engagement Level:', totalActivities > 20 ? 'Excellent' : totalActivities > 10 ? 'Good' : totalActivities > 5 ? 'Moderate' : 'Getting Started']
    ];

    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    summaryStats.forEach(([label, value]) => {
      doc.setFont(undefined, 'bold');
      doc.text(label, 20, yPos);
      doc.setFont(undefined, 'normal');
      doc.text(String(value), 75, yPos);
      yPos += 8;
    });

    yPos += 10;

    
    doc.setFillColor(255, 250, 230);
    doc.rect(14, yPos, pageWidth - 28, 10, 'F');
    doc.setFontSize(14);
    doc.setTextColor(243, 156, 18);
    doc.text('Recommendations', 20, yPos + 7);
    yPos += 18;

    const recommendations = generateRecommendations(childModeProgress, playTogetherProgress);
    doc.setFontSize(11);
    doc.setTextColor(51, 51, 51);
    recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`, 20, yPos, { maxWidth: pageWidth - 40 });
      yPos += 10;
    });

    
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(102, 126, 234);
    doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('Generated by Parent Dashboard - Educational Progress Tracking', pageWidth / 2, pageHeight - 7, { align: 'center' });

    
    doc.save(`${child?.name || 'Child'}_Progress_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const generateRecommendations = (childMode, playTogether) => {
    const recommendations = [];

    if (!childMode && !playTogether) {
      recommendations.push('Start with Child Mode activities to establish baseline learning');
      recommendations.push('Try Play Together Mode to build parent-child bonding');
      return recommendations;
    }

    const totalActivities = (childMode?.activitiesCompleted || 0) + (playTogether?.gamesPlayedTogether || 0);
    const totalTime = (childMode?.totalTimeSpent || 0) + (playTogether?.totalTimeSpent || 0);

    if (totalActivities < 5) {
      recommendations.push('Encourage more regular practice - aim for 3-4 activities per week');
    }

    if (totalTime < 30) {
      recommendations.push('Try to increase engagement time to at least 30 minutes per week');
    }

    if (!playTogether || playTogether.gamesPlayedTogether < 3) {
      recommendations.push('Increase Play Together sessions to strengthen parent-child collaboration');
    }

    if (childMode?.totalPoints > 100) {
      recommendations.push('Excellent progress! Consider introducing more challenging activities');
    }

    if (playTogether?.teamStars > 10) {
      recommendations.push('Great teamwork! Your child responds well to cooperative learning');
    }

    if (recommendations.length === 0) {
      recommendations.push('Keep up the great work! Maintain current activity level');
      recommendations.push('Explore different game types to develop diverse skills');
    }

    return recommendations;
  };

  if (loading) {
    return <div className="loading">Loading progress report...</div>;
  }

  return (
    <div className="progress-report">
      <div className="report-header">
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>📊 Progress Report</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-refresh" onClick={fetchData}>
            🔄 Refresh
          </button>
          <button className="btn-download" onClick={generatePDF}>
            📥 Download PDF
          </button>
        </div>
      </div>

      <div className="report-content">
        
        <div className="info-card">
          <h2>👤 Child Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{child?.name || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Age:</span>
              <span className="value">{child?.age || 'N/A'} years</span>
            </div>
            <div className="info-item">
              <span className="label">Gender:</span>
              <span className="value">{child?.sex || 'N/A'}</span>
            </div>
            <div className="info-item">
              <span className="label">Level:</span>
              <span className="value">{child?.learningLevel || 'beginner'}</span>
            </div>
          </div>
        </div>

        
        <div className="progress-card child-mode">
          <h2>🎮 Child Mode Progress</h2>
          {childModeProgress ? (
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-icon">🏆</span>
                <span className="stat-value">{childModeProgress.totalPoints || 0}</span>
                <span className="stat-label">Total Points</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">✅</span>
                <span className="stat-value">{childModeProgress.activitiesCompleted || 0}</span>
                <span className="stat-label">Activities</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">🎯</span>
                <span className="stat-value">{childModeProgress.gamesPlayed || 0}</span>
                <span className="stat-label">Games Played</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">⏱️</span>
                <span className="stat-value">{childModeProgress.totalTimeSpent || 0}</span>
                <span className="stat-label">Minutes</span>
              </div>
            </div>
          ) : (
            <div className="no-data">
              <p>No Child Mode data available yet</p>
              <p className="hint">Encourage your child to play educational games!</p>
            </div>
          )}
        </div>

        
        <div className="progress-card play-together">
          <h2>👨‍👩‍👧 Play Together Progress</h2>
          {playTogetherProgress ? (
            <div>
              <div className="stats-grid">
                <div className="stat-box">
                  <span className="stat-icon">🎮</span>
                  <span className="stat-value">{playTogetherProgress.gamesPlayedTogether || 0}</span>
                  <span className="stat-label">Games Together</span>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">👨‍👩‍👧</span>
                  <span className="stat-value">{playTogetherProgress.familyPoints || 0}</span>
                  <span className="stat-label">Family Points</span>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">⭐</span>
                  <span className="stat-value">{playTogetherProgress.teamStars || 0}</span>
                  <span className="stat-label">Team Stars</span>
                </div>
                <div className="stat-box">
                  <span className="stat-icon">⏱️</span>
                  <span className="stat-value">{playTogetherProgress.totalTimeSpent || 0}</span>
                  <span className="stat-label">Minutes</span>
                </div>
              </div>
              {playTogetherProgress.teamworkBadges && playTogetherProgress.teamworkBadges.length > 0 && (
                <div className="badges-section">
                  <h3>🏅 Teamwork Badges</h3>
                  <div className="badges-list">
                    {playTogetherProgress.teamworkBadges.map((badge, index) => {
                      const badgeName = typeof badge === 'object' ? badge.name : badge;
                      const badgeIcon = typeof badge === 'object' ? badge.icon : '';
                      return (
                        <span key={index} className="badge">{badgeIcon} {badgeName}</span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-data">
              <p>No Play Together data available yet</p>
              <p className="hint">Start playing cooperative games together!</p>
            </div>
          )}
        </div>

        
        <div className="summary-card">
          <h2>📈 Summary & Recommendations</h2>
          {(() => {
            const totalPoints = (childModeProgress?.totalPoints || 0) + (playTogetherProgress?.familyPoints || 0);
            const totalActivities = (childModeProgress?.activitiesCompleted || 0) + (playTogetherProgress?.gamesPlayedTogether || 0);
            const recommendations = generateRecommendations(childModeProgress, playTogetherProgress);

            return (
              <div>
                <div className="summary-stats">
                  <div className="summary-item">
                    <span className="summary-label">Total Points:</span>
                    <span className="summary-value">{totalPoints}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Total Activities:</span>
                    <span className="summary-value">{totalActivities}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Engagement:</span>
                    <span className="summary-value">
                      {totalActivities > 20 ? '⭐⭐⭐ Excellent' : 
                       totalActivities > 10 ? '⭐⭐ Good' : 
                       totalActivities > 5 ? '⭐ Moderate' : 
                       'Getting Started'}
                    </span>
                  </div>
                </div>
                <div className="recommendations">
                  <h3>💡 Recommendations:</h3>
                  <ul>
                    {recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ProgressReport;
