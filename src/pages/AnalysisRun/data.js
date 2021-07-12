const run = {
  data: {
    status: 'review',
    items: [
      {
        id: 1,
        company_short: 'COMPANYSHORT',
        pool_name: 'M1',
        sampale_id: 'EQ12345678',
        status: 'Inconclusive',
        reflex_sc: true,
        reflex_sd: false,
        rerun: false,
        children: [
          {
            id: '001',
            wells: 'A3',
            ms2: 27.27,
            n_gene: 5.27,
            s_gene: 33.33,
          },
          {
            id: '002',
            wells: 'A4',
            ms2: 27.27,
            n_gene: 4.11,
            s_gene: 33.33,
          },
          {
            id: '003',
            wells: 'B4',
            ms2: 27.27,
            n_gene: 5.27,
            s_gene: 33.33,
          },
        ],
      },
      {
        id: 2,
        company_short: 'COMPANYSHORT',
        pool_name: 'M2',
        sampale_id: 'EQ87654321',
        status: 'Not Detected',
        reflex_sc: false,
        reflex_sd: false,
        rerun: true,
        children: [
          {
            id: '001',
            wells: 'A3',
            ms2: 27.27,
            n_gene: 5.27,
            s_gene: 33.33,
          },
          {
            id: '002',
            wells: 'A4',
            ms2: 27.27,
            n_gene: 4.27,
            s_gene: 33.33,
          },
          {
            id: '003',
            wells: 'B4',
            ms2: 27.27,
            n_gene: 4.27,
            s_gene: 33.33,
          },
        ],
      },
    ],
  },
};

export default run;
