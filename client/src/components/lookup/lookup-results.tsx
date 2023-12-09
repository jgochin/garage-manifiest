import React from 'react';
import { useLookupContext } from './lookup-context';
import { FaEye } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom';

const LookupResults: React.FC = () => {
    const { lookupData } = useLookupContext();
    const navigate = useNavigate()

    return (
        <div className="lookup-results">
            {lookupData.searchResults.length > 0 ? (<table className="items">
                <thead>
                    <tr>
                        <th className="col-1">Item</th>
                        <th className="col-2">Location</th>
                    </tr>
                </thead>
                <tbody>
                    {lookupData.searchResults.map((item) => (
                        <tr key={item.hash}>
                            <td>{item.item}</td>
                            <td className="col-2" onClick={() => navigate(`/location/${item.location}`)}>
                                <span>{item.location}<FaEye /></span></td>
                        </tr>
                    ))
                    }
                </tbody>
            </table >) : (
                <p className="text-center">No results to display.</p>
                // You can replace this with any message or component you want to show when there are no results.
            )}
        </div>
    );
};

export default LookupResults;
