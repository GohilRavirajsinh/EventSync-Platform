import React from 'react';
import { useParams } from 'react-router-dom';

const EventDetail = () => {
    const { id } = useParams();

    return (
        <div className="p-10 text-center text-2xl font-bold">
            Ye Event ID: {id} ka page hai!
        </div>
    )
}

export default EventDetail;