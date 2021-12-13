type Config = {
  apiUrl: string;
};

const local: Config = {
  apiUrl: "https://jsonplaceholder.typicode.com",
};

export const config = local;
