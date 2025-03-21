import { getEID } from 'src/utils';

type Resource = {
  url: string;
  method: string;
  body?: string;
};

const baseUrl = 'http://185.244.172.108:8081';

const getResource = async ({ url, method, body }: Resource) => {
  let config: RequestInit = {};

  if (body) {
    config.body = body;
  }

  let res = await fetch(url, {
    method,
    ...config,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
  if (!res.ok) {
    throw new Error(`Could not fetch ${url}, status: ${res.status}`);
  }
  return await res.json();
};

export const createEntity = () => {
  return getResource({
    url: `${baseUrl}/v1/outlay-rows/entity/create`,
    method: 'POST',
  });
};

export const getTreeRows = () => {
  const eId = getEID();

  return getResource({
    url: `${baseUrl}/v1/outlay-rows/entity/${eId}/row/list`,
    method: 'GET',
  });
};

export const createRowInEntity = ({
  rowName,
  salary,
  equipmentCosts,
  overheads,
  estimatedProfit,
  parentId = null,
}: {
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
  parentId?: null | number;
}) => {
  const eId = getEID();

  return getResource({
    url: `${baseUrl}/v1/outlay-rows/entity/${eId}/row/create`,
    method: 'POST',
    body: JSON.stringify({
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      supportCosts: 0,
      parentId,
      equipmentCosts,
      estimatedProfit,
      overheads,
      rowName,
      salary,
    }),
  });
};

export const deleteRow = (id: number) => {
  const eId = getEID();

  return getResource({
    url: `${baseUrl}/v1/outlay-rows/entity/${eId}/row/${id}/delete`,
    method: 'DELETE',
  });
};

export const updateRow = ({
  id,
  rowName,
  salary,
  equipmentCosts,
  overheads,
  estimatedProfit,
}: {
  id: number;
  rowName: string;
  salary: number;
  equipmentCosts: number;
  overheads: number;
  estimatedProfit: number;
}) => {
  const eId = getEID();

  return getResource({
    url: `${baseUrl}/v1/outlay-rows/entity/${eId}/row/${id}/update`,
    method: 'POST',
    body: JSON.stringify({
      machineOperatorSalary: 0,
      mainCosts: 0,
      materials: 0,
      mimExploitation: 0,
      supportCosts: 0,
      equipmentCosts,
      estimatedProfit,
      overheads,
      rowName,
      salary,
    }),
  });
};
