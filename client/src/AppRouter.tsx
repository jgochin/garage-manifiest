import Location from '@app/location';
import Locations from '@app/locations'
import Lookup from '@app/lookup';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NetworkAdmin from '@app/admin/network';
import LocationAdd from '@app/locations/add';
import LocationEdit from '@app/locations/edit';

const AppRouter: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" index element={<Lookup />} />
                <Route path="/admin/network" element={<NetworkAdmin />} />
                <Route path="/location/:id" element={<Location />} />
                <Route path="/locations/:id/edit" element={<LocationEdit />} />
                <Route path="/locations" element={<Locations />} />
                <Route path="/locations/add" element={<LocationAdd />} />
                <Route path="*" element={<Lookup />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
