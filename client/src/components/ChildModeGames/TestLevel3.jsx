import React from 'react';
import ReactDOM from 'react-dom/client';
import CategorizationGame from './ChildModeGames/CategorizationGame';


const TestLevel3 = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <CategorizationGame 
        totalPoints={35}
        onComplete={(data) => console.log('Game Complete:', data)}
        onClose={() => console.log('Game Closed')}
      />
    </div>
  );
};






export default TestLevel3;
