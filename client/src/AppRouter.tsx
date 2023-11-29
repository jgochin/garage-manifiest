import Location from '@app/location';
import Lookup from '@app/lookup';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NetworkAdmin from '@app/admin/network';
import LocationAdd from '@app/admin/add-location';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" index element={<Lookup />} />
                <Route path="/admin/network" element={<NetworkAdmin />} />
                <Route path="/location/add" element={<LocationAdd />} />
                <Route path="/location/:id" element={<Location />} />
                <Route path="*" element={<Lookup />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
