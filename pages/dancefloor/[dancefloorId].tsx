import { useRouter } from 'next/router';
import React from 'react';

const DancefloorPage = () => {
  const router = useRouter();
  const { dancefloorId } = router.query;

  return (
    <div>
      <h1>Dancefloor Placeholder Page</h1>
      <p>Dancefloor ID: {dancefloorId}</p>
    </div>
  );
};

export default DancefloorPage;
