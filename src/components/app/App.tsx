import { useState, useEffect } from 'react';
import { AppHeader } from '../AppHeader/AppHeader';
import { Aside } from '../Aside/Aside';
import { Table } from '../Table/Table';
import './App.style.scss';
import { createEntity } from 'src/services/api';
import { getEID } from 'src/utils';

export function App() {
  const handleCreateAndFetch = async () => {
    try {
      const createdEntity = await createEntity();
      const { id } = createdEntity;
      localStorage.setItem('eID', id);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!getEID()) {
      handleCreateAndFetch();
    }
  }, []);

  return (
    <div className="app">
      <AppHeader />
      <main>
        <Aside />
        <Table />
      </main>
    </div>
  );
}
