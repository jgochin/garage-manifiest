import React, { useEffect } from 'react';
import AppRouter from 'AppRouter'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from 'AppContext';
import { FaPlus } from 'react-icons/fa6';

const App: React.FC = () => {
  return (
    <div className="garage-manifest abs-container overflow-hidden">
      <div className="top">
        <h1>Garage Manifest</h1>
        {/* <Link to={'/location/add'} className="mr-4 border rounded-md p-2"><FaPlus className="text-xl font-semibold text-slate-300 mr-2 inline-block" /><span className="text-lg font-semibold text-slate-300">New Location</span></Link> */}
      </div>
      <div className="middle relative">
        <AppRouter />
        <Outlet />
      </div>
    </div>

  );
};

export default App;
