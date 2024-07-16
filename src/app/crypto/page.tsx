'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getEncAndDec } from '@/services/apiService';
import { Suspense, useState } from 'react';

export default function Crypto() {
  return (
    <div className="container mt-16 md:mt-32 text-center font-thin">
      <h1 className="text-3xl text-center font-normal">crypto - test</h1>
      <Suspense>
        <PageContent />
      </Suspense>
    </div>
  );
}

function PageContent() {
  const [data, setData] = useState('');
  const [enc, setEnc] = useState('');
  const [dec, setDec] = useState('');

  const onSubmit = () => {
    getEncAndDec(data)
      .then(data => {
        console.log(data);
        setEnc(data.enc);
        setDec(data.dec);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="mt-4 text-center font-thin">
      <Input
        className="mt-4 mx-auto p-2 md:w-1/2 text-center border-0"
        value={data}
        placeholder="Enter data"
        onChange={e => setData(e.target.value)}
      />
      <Button className="mt-4" onClick={onSubmit}>
        Submit
      </Button>
      <p>{enc}</p>
      <p>{dec}</p>
    </div>
  );
}
