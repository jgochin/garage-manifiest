import React from 'react';
import { useLookupContext } from './lookup-context';
import { Link } from 'react-router-dom';

const LookupResults: React.FC = () => {
    const { lookupData } = useLookupContext();

    return (
        <div className="lookup-results mr-4 ml-4">
            {lookupData.searchResults.length > 0 ? (<table className="min-w-full">
                <thead>
                    <tr className="bg-slate-300">
                        <th className="header col-1">Item</th>
                        <th className="header col-2">Location</th>
                    </tr>
                </thead>
                <tbody>
                    {lookupData.searchResults.map((item) => (
                        <tr key={item.hash}>
                            <td className="cell col-1">{item.item}</td>
                            <td className="cell col-2 whitespace-nowrap text-center"><Link to={`/location/${item.location}`}>{item.location}</Link></td>
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
