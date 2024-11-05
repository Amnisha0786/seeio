import lodash from "lodash";
import moment from "moment";

import { SORT_OPTIONS } from "@/constants";
import { StatusVdr, TFilterOptions } from '@/models';

function isFetchError(error: any) {
  return (
    !!error && lodash.hasIn(error, "status") && lodash.isFunction(error.json)
  );
}

async function getFetchError(error: any) {
  try {
    return await error.json();
  } catch (e) {
    return null;
  }
}

export default class Misc {
  static trimObjectProperties = (obj: any, properties: string[]): any => {
    const data = lodash.cloneDeep(obj);

    if (lodash.isArray(properties)) {
      properties.forEach((property) => {
        data[property] = data[property]?.trim();
      });
    } else {
      lodash.keys(obj).forEach((key) => {
        data[key] = data[key]?.trim();
      });
    }

    return data;
  };

  static getErrorJsonBody = async (error: any): Promise<any> => {
    if (isFetchError(error)) {
      error = await getFetchError(error);
    }

    return error;
  };

  static insert = (array: any[], index: number, value: any): any[] =>
    array
      .slice(0, index)
      .concat(value)
      .concat(array.slice(index, array.length));

  static getFilteredData = (
    items: any[],
    search: string,
    sortValue: string | undefined,
    nameKey?: string,
    dateCreated?: string,
    filter?: TFilterOptions
  ) => {
    const name = nameKey || "name";
    const date = dateCreated || "dateCreated";
    let newData = [...items];
    newData = newData.filter((item) =>
      item[name]?.toLowerCase()?.includes(search?.trim().toLowerCase())
    );
    if (sortValue) {
      if (sortValue === SORT_OPTIONS.NAME) {
        newData = newData.sort(function (current, accumulator) {
          if (
            current?.[name].toLocaleLowerCase() <
            accumulator?.[name].toLocaleLowerCase()
          ) {
            return -1;
          }
          if (
            current?.[name].toLocaleLowerCase() >
            accumulator?.[name].toLocaleLowerCase()
          ) {
            return 1;
          }
          return 0;
        });
      } else if (sortValue === SORT_OPTIONS.RECENTLY) {
        newData = newData.sort(function (current, accumulator) {
          if (
            new Date(current?.[date]).getTime() <
            new Date(accumulator?.[date]).getTime()
          ) {
            return 1;
          }
          if (
            new Date(current?.[date]).getTime() >
            new Date(accumulator?.[date]).getTime()
          ) {
            return -1;
          }
          return 0;
        });
      }
    }
    if (filter) {
      if (filter?.group) {
        newData = newData.filter((item) =>
          item?.["group"]?.toLowerCase()?.includes(filter.group?.trim().toLowerCase())
        );
      }
      if (filter?.status) {
        newData = newData.filter((item) =>
          item?.["status"]?.toLowerCase()?.includes(filter.status?.trim().toLowerCase())
        );
      }
      if (filter?.date?.from && filter?.date?.to) {
        newData = newData.filter((item) => {
          const filtered = moment(item?.reviewDate).isBetween(filter?.date?.from || moment(), filter?.date?.to || moment())
          return filtered
        }
        );
      }
    }
    return newData;
  };

  static isJson = (str: string) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}

export const getVDRStatus = (status: string) => {
  if (status === StatusVdr.IN_PROGRESS) {
    return {
      title: "In progress",
      color: "yellow",
    };
  } else if (status === StatusVdr.COMPLETED) {
    return {
      title: "Completed",
      color: "green",
    };
  } else if (status === StatusVdr.READY) {
    return {
      title: "Ready",
      color: "green",
    };
  } else if (status === StatusVdr.DELETED) {
    return {
      title: "Deleted",
      color: "red",
    };
  } if (status === StatusVdr.NOT_STARTED) {
    return {
      title: "Not started",
      color: "white",
    };
  }
};
