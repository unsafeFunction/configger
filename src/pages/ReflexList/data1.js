const data = {
  data: {
    '2020-08-05': [
      {
        sample_id: 'uuid',
        company_short: 'COMPANY_SHORT',
        pool_name: 'F1',
        display_sample_id: 'EQ00000000',
        analysis_result: 'INCONCLUSIVE',
        rack_id: 'MM00000000',
        pool_run: 'some run title',
        rerun_action: 'Reflex SC',
        reflex_run: 'some run title',
        pool_rack_id: 'ER00000000',
        pool_rack: 'some poolrack title',
        position: 'A1',
        details: [
          {
            tube_type: 'EQ00000000',
            tube_id: 'Pool',
            analysis_result: 'INCONCLUSIVE',
            mean: {
              'N gene': '28.280492267536044',
              'S gene': '28.280492267536044',
              ORF1ab: '28.280492267536044',
              RP: '28.280492267536044',
            },
            standard_deviation: {
              'N gene': '0.1335593511819563',
              'S gene': '0.1335593511819563',
              ORF1ab: '3',
              RP: '',
            },
          },
        ],
      },
    ],
  },
};

export default data;
