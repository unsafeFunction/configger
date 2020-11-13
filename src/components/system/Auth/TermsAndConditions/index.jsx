import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, Typography, Layout } from 'antd';
import style from '../style.module.scss';
import actions from 'redux/user/actions';

const TermsAndConditions = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [isAgreed, agree] = useState(false);

  const onSubmit = useCallback(
    values => {
      dispatch({
        type: actions.ACCEPT_REQUEST,
        payload: {
          ...values,
          redirect: () => history.push('/dashboard'),
        },
      });
    },
    [dispatch],
  );

  const user = useSelector(state => state.user);

  const { isAccepting } = user;
  const { Footer, Content } = Layout;
  const { Title, Paragraph, Text } = Typography;

  return (
    <Layout>
      <Content
        style={{ marginLeft: '20%', marginRight: '20%', marginBottom: '5%' }}
      >
        <Title className="text-center my-4" level={3}>
          COVID-19 TESTING
        </Title>
        <Title className="text-center pb-4" level={3}>
          GENERAL TERMS AND CONDITIONS
        </Title>
        <Paragraph className={`${style.paragraph}`}>
          The following represents the{' '}
          <Text className="font-italic">
            General Terms and Conditions applicable
          </Text>{' '}
          to the Mirimus COVID-19 Testing Program. Acceptance of any service or
          Service Agreement (
          <Text className="font-weight-bold">«Service Agreement»</Text>) shall
          be deemed agreement to these terms and conditions. No purchase order
          or other document transmitted by purchaser or recipient that may
          modify the terms and conditions hereof, shall be in any way binding on
          Mirimus, and instead the terms and conditions set forth herein,
          including any special terms and conditions set forth separately, shall
          govern the sale of services by Mirimus.
        </Paragraph>
        <Paragraph className={`${style.paragraph}`}>
          WHEREAS the Mirimus, Inc. located at 760 Parkside Ave. Suite 206,
          Brooklyn, NY 11226 (<Text className="font-italic">«Mirimus»</Text> or
          the <Text className="font-italic">«Laboratory»</Text>) has created a
          testing program for detecting Covid-19 referred to as the «Mirimus
          COVID-19 Testing Program»);
        </Paragraph>
        <Paragraph className={`${style.paragraph}`}>
          WHEREAS, pursuant to the Mirimus COVID-19 Testing Program, Mirimus
          receives saliva or other samples («Samples») from customers in the
          manner set forth more specifically in the Service Agreement and tests
          such Samples using proprietary testing for the presence of SARS-CoV-2
          nucleic acid (the <Text className="font-weight-bold">«Program»</Text>
          );
        </Paragraph>
        <Paragraph className={`${style.paragraph}`}>
          WHEREAS, the presence of SARS-CoV-2 nucleic acid, along with other
          clinical factors, is indicative although not determinative, of
          COVID-19 infection or infectivity; and,
        </Paragraph>
        <Paragraph className={`${style.paragraph}`}>
          WHEREAS, Organization desires to participate in the Program in
          accordance with the terms and conditions of this Agreement.
        </Paragraph>
        <Paragraph className={`${style.paragraph}`}>
          <Text className="font-weight-bold">NOW, THEREFORE</Text>, in
          consideration of the premises and mutual and dependent promises set
          forth herein, the Parties hereto agree as follows:
        </Paragraph>
        <Paragraph className={`${style.aligned} my-4`}>
          <ol>
            <li>
              <Text className="font-weight-bold">
                Laboratory Services and Service Agreement.
              </Text>{' '}
              The parties agree that, upon receipt of saliva samples, the
              Laboratory will provide laboratory testing services to
              Organization as set forth in the Program as further defined herein
              and as provided in one or more Service Agreements executed by the
              Parties from time to time and the General Terms and Conditions. In
              the event of conflict, the General Terms and Conditions shall
              govern unless expressly modified in the Service Agreement.
            </li>
            <li>
              <Text className="font-weight-bold">Fees and Payment.</Text>{' '}
              Organization will pay the fees set forth in the Service Agreement
              in accordance with the payment terms set forth in the Service
              Agreement. Unless otherwise stated in the Service Agreement, fees
              shall be payable within 30 days of invoice and, in the event of an
              advance deposit, may be withdrawn against such deposit. Payment
              shall be made by wire transfer to an address as set forth in the
              Service Agreement or other electronic means. Failure to timely pay
              renders the Organization in Default. Laboratory may suspend its
              Services if Organization is in default of its payment obligations
              hereunder or establish other payment arrangements, such as a
              deposit, to ensure timely payment. If any fees are not paid by
              Organization on the relevant due date, Laboratory shall be
              entitled to charge interest on the unpaid amount until payment is
              made in full. Interest shall be calculated using the lesser of (i)
              one percent (1%) per month (12% per annum) or (ii) to the maximum
              extent permitted by law.
            </li>
            <li>
              <Text className="font-weight-bold">Term and Termination.</Text>{' '}
              The term of this Agreement shall continue from the Commencement
              Date until completion of all Services of all Service Agreements
              referencing this Agreement and receipt of payment for such
              Services. This Agreement may also be terminated because of: (a)
              Default by Organization; (b) the safety of the Participants, which
              shall include the failure of Organization to obtain a valid
              Consent; © marketing authorization is terminated pursuant to
              Section 6(b); or (d) for material breach by the other party of any
              Service Agreement or this Agreement, as applicable, which is not
              cured within 30 days from the receipt by the party in breach of a
              written notice from the other party specifying the breach in
              detail. Organization shall be liable for payment to Laboratory for
              all fees due for Services rendered prior to the effective date of
              any such termination and for any costs or expenses associated with
              wind-down of the Services specific to the Organization.
            </li>
            <li>
              <Text className="font-weight-bold">
                Sample Collection, Testing Obligations and Procedures.
              </Text>{' '}
              The Parties shall be required to perform the following tasks:
              <ul>
                <li>
                  <Text className="font-weight-bold">Participant Consent.</Text>{' '}
                  Organization shall obtain the written, voluntary,
                  contemporaneous, witnessed, informed consent of each
                  participant of Organization (a{' '}
                  <Text className="font-weight-bold">«Participant»</Text>) to
                  testing under the Program which consent shall include a broad
                  consent, as so defined by the Office of Human Research
                  Protection in the Common Rule (Title 45 of the U. S. Code of
                  Federal Regulations, Part 46, and related regulations for
                  other federal departments), for the use of the Samples by
                  Laboratory. The consent will include information about
                  Laboratory in the event that the Participant wishes to
                  withdraw such broad consent.
                </li>
                <li>
                  <Text className="font-weight-bold">Barcodes.</Text>{' '}
                  Organization shall provide Laboratory with anonymized or
                  deidentified data about the Participant, as may be requested,
                  and shall barcode samples. Organization shall not provide
                  personal information to Laboratory. Organization shall
                  maintain a decode which permits identification of the
                  Participant from the Barcode. Laboratory shall provide each
                  Organization with Barcoded proprietary tubes for collection of
                  Samples by Participants. Organization will or cause
                  Participant to note the Barcode on the tube each time a sample
                  is submitted. Each Participant shall also be instructed to
                  maintain that Participant’s Barcode and consent to
                  Organization’s maintaining the decode. The Laboratory will not
                  be responsible for assigning Barcodes to Participants.
                </li>
                <li>
                  <Text className="font-weight-bold">Sample Collection.</Text>{' '}
                  Sample collection of saliva will be performed as instructed in{' '}
                  <Text className="font-italic">Exhibit «A»</Text>. Laboratory
                  shall have no responsibility for the collection of samples.
                  Organization will, or will cause Participant to, affix
                  Barcodes to the sterile container or use pre-Barcoded
                  containers. Samples submitted by Participants to the
                  Organization will be stored by the Organization at controlled
                  room temperature and, in the event of ambient humidity above
                  50%, in appropriate air-conditioned room temperature settings.
                  Laboratory shall provide shipping containers that are
                  compliant with regulations issued by the U. S. Department of
                  Transportation for biosamples. Organization is responsible for
                  shipping samples to Laboratory for testing in accordance with
                  the instructions provided by Laboratory. If Organization ships
                  samples, Organization will comply with Laboratory’s shipping
                  specifications with ice packs in an insulated container,
                  marked for overnight shipping with pre-addressed
                  biocontainment envelopes. Organization is responsible for all
                  shipping charges.
                </li>
                <li>
                  <Text className="font-weight-bold">Test Results.</Text>{' '}
                  Laboratory shall administer the tests on Samples received from
                  Organization and report results of the testing to Organization
                  in accordance with the Service Agreement.
                </li>
              </ul>
            </li>
            <li>
              <Text className="font-weight-bold">Participant Privacy.</Text>
              <ul>
                <li>
                  Laboratory is not a Business Associate as that term is defined
                  in the Health Insurance Portability and Accountability Act as
                  amended by Health Information Technology or Economic and
                  Clinical Health Act or as may be amended from time-to-time.
                </li>
                <li>
                  As an entity regulated pursuant to the Federal, Food, Drug,
                  and Cosmetics Act, Organization acknowledges that Laboratory
                  is subject to an exclusion from status as a Business Associate
                  pursuant to Title 42 U. S. Code of Federal Regulations,
                  Section 164.512(b)(1)(iii), in the event that personal,
                  identifying, or non-anonymized data are provided to
                  Laboratory.
                </li>
              </ul>
            </li>
            <li>
              <Text className="font-weight-bold">Applicable Laws.</Text>
              <ul>
                <li>
                  <Text className="font-weight-bold">Compliance with Law.</Text>{' '}
                  The Parties shall comply with all laws governing the
                  collection, shipment, and testing of Samples («Applicable
                  Laws»).
                </li>
                <li>
                  <Text className="font-weight-bold">
                    Marketing Authorization for Program.
                  </Text>{' '}
                  The Program, including Sample collection by Organization, is
                  subject to the Federal Food, Drug, and Cosmetics and
                  regulations promulgated thereunder and as enforced by the U.S
                  Food and Drug Administration («FDA»). Pursuant to that
                  executive authority, FDA has notified Laboratory that the
                  Program is defined as a Laboratory Developed Test («LDT»).
                  LDT’s are subject the Clinical Laboratories Improvement Act
                  («CLIA») as enforced by the Centers for Medicare and Medicaid
                  Services («CMS») pursuant to delegation of FDA’s authority to
                  CMS. FDA has notified Laboratory, as well, that marketing is
                  authorized if authorized by the New York State Department of
                  Health (NYS DOH). NYS DOH has notified Laboratory that the
                  Program is authorized pursuant to this delegation from FDA.
                  Laboratory is certified pursuant to CLIA. The Program is
                  therefore authorized through both CLIA and NYS DOH delegated
                  authorities. Laboratory shall notify Organization of any
                  changes to such marketing authorization.
                </li>
                <li>
                  <Text className="font-weight-bold">
                    Inspectional Authority.
                  </Text>{' '}
                  Both Parties acknowledge that each of FDA, CMS, CMS delegees
                  or accreditors, the New York State Department of Health or
                  other comparable state or local regulatory authorities
                  («Regulatory Authorities») have independent legal authority to
                  enter and inspect the operations of Laboratory and those
                  operations of Organization that are related to informed
                  consent, Sample collection and other activities at
                  Organization that are related to the Program. Both Parties
                  acknowledge and agree that, in the event of such inspection,
                  the Parties will cooperate and collaborate on providing
                  required documentation or addressing any requests by such
                  Regulatory Authorities.
                </li>
              </ul>
            </li>
            <li>
              <Text className="font-weight-bold">
                Laboratory Representations, Warranties and Acknowledgments.
              </Text>
              <ul>
                <li>
                  Laboratory warrants that the Services will be performed with
                  due care in accordance with Laboratory’s procedures and
                  generally prevailing clinical laboratory standards. Any breach
                  of this warranty must be reported to Laboratory by
                  Organization within seven (7) days of performance of the
                  Service in breach of the warranty. If a breach of warranty is
                  reported within such seven (7) day period, then Laboratory
                  will either reperform the Services or provide a credit for
                  fees paid for Services performed in violation of the warranty,
                  which shall be Organization’s sole remedy for breach of this
                  warranty.
                </li>
                <li>
                  Laboratory does not warrant or guaranty that testing results
                  will be accurate nor that the Program can detect the presence
                  of COVID-19 in any or all of the Sample of the Participants or
                  Organizations.
                </li>
                <li>
                  TO THE EXTENT PERMITTED UNDER APPLICABLE LAW, EXCEPT FOR THE
                  WARRANTY IN SECTION 5(a), LABORATORY DISCLAIMS ALL OTHER
                  WARRANTIES RELATED TO THE SERVICE, EITHER EXPRESS OR IMPLIED,
                  INCLUDING THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
                  FITNESS FOR A PARTICULAR PURPOSE.
                </li>
                <li>
                  ANY TESTING MATERIALS, SUPPLIES OR EQUIPMENT PROVIDED TO
                  ORGANIZATION BY LABORATORY IS PROVIDED ON AN «AS-IS»,
                  «WHERE-IS» BASIS AND WITHOUT WARRANTY.
                </li>
              </ul>
            </li>
            <li>
              <Text className="font-weight-bold">
                Organization Representations, Warranties and Acknowledgments.
              </Text>
              <ul>
                <li>
                  Organization represents and warrants to Laboratory that it has
                  obtained the Consent set forth in Section 4(a) from every
                  Participant and has maintained documentation thereof.
                </li>
                <li>
                  Organization acknowledges and agrees that Laboratory assumes
                  no responsibility or liability for any purpose for which
                  Organization chooses to use test results.
                </li>
                <li>
                  Organization acknowledges and agrees that it has no
                  proprietary Intellectual Property right, and will have no
                  rights, covering, claiming or relating to current or future
                  processes for the Program.
                </li>
              </ul>
            </li>
            <li>
              <Text className="font-weight-bold">Confidentiality.</Text>
              <ul>
                <li>
                  Confidential Information includes any information provided by
                  Laboratory (or Laboratory’s behalf) to Organization, whether
                  directly or indirectly, in writing, orally, electronically or
                  by drawings or inspection of equipment, products, facilities,
                  software or other property of Laboratory, including, but not
                  limited to: (a) any information, regardless of form,
                  proprietary to, or maintained in confidence by, the
                  Laboratory, including, without limitation, any information,
                  patents, patent applications, technical data, or know-how
                  relating to products, formulations, manufacturing,
                  discoveries, ideas, inventions, concepts, software, equipment,
                  designs, drawings, specifications, techniques, processes,
                  systems, models, data, source code, object code,
                  documentation, diagrams, flow charts, research, development,
                  studies, analyses, business plans or opportunities, business
                  strategies, marketing plans or opportunities, marketing
                  strategies, future projects or products, projects or products
                  under consideration, procedures, sales data, and information
                  related to finances, costs, prices, suppliers, vendors,
                  licensors, licensees, business partners, customers, consumers
                  and employees; and (b) any other information marked as
                  confidential or, if not marked in writing, identified as
                  confidential at the time of disclosure (collectively,{' '}
                  <Text className="font-weight-bold">
                    «Confidential Information»
                  </Text>
                  ).
                </li>
                <li>
                  Organization shall safeguard Confidential Information from
                  disclosure to third parties with the same degree of care as it
                  exercises with its own data and license agreements of a
                  similar nature, but no less than a reasonable degree of care.
                </li>
                <li>
                  The parties acknowledge that the Confidential Information, as
                  may exist from time to time, is valuable, special, and unique
                  asset of each party’s business. The parties will not, except
                  as otherwise set forth herein, during or after the Term,
                  disclose such Confidential Information or any part thereof to
                  any person, firm, corporation, association, or other entity
                  for any reason or purpose whatsoever, except in the limited
                  manner authorized in this section. In addition, neither party
                  will appropriate, disclose, remove, conceal or obliterate any
                  trademark, patent, copyright or other proprietary rights of
                  the other party, including Confidential Information, without
                  prior written consent of the owner.
                </li>
                <li>
                  In the event of a breach or threatened breach of the
                  provisions of this paragraph, Laboratory shall be entitled to
                  injunctive or other similar equitable relief restraining
                  Organization from disclosing such Confidential Information and
                  Organization hereby consents to jurisdiction for such
                  potential injunctive relief in the state or federal courts of
                  New York. Organization shall bear all legal costs and expenses
                  related to Laboratory seeking such injunctive relief.
                </li>
                <li>
                  Each Party agrees not to disclose Confidential Information to
                  others (except to their Participants, agents or consultants
                  who have a need to know the information and who are bound by a
                  like obligation of confidentiality), except that the Parties
                  shall not be prevented from using or disclosing any of the
                  data:
                  <ul>
                    <li>
                      which is lawfully obtained by the receiving party from a
                      source independent of the disclosing party;
                    </li>
                    <li>
                      which the receiving party can demonstrate by documentary
                      evidence was independently developed by Organization;
                    </li>
                    <li>
                      which is required by law, regulation, or court order to be
                      disclosed,{' '}
                      <Text className="font-italic">provided that</Text>, if
                      permissible by law, Organization shall authorize
                      Laboratory to assert any legal rights on behalf of itself
                      or Organization to prevent disclosure of such Confidential
                      Information; or
                    </li>
                    <li>
                      which is now, or becomes in the future, public knowledge
                      other than through acts or omissions of the receiving
                      party.
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <Text className="font-weight-bold">
                Indemnification; Limitation of Liability.
              </Text>
              <ul>
                <li>
                  The Laboratory shall defend, indemnify and hold harmless the
                  Organization from and against any liabilities, losses,
                  damages, costs and expenses (including without limitation,
                  reasonable attorneys’ fees and expenses) arising out of a
                  claim against Organization by a third party that results from
                  Laboratory’s breach of this Agreement, negligent acts or
                  omissions, or intentional misconduct.
                </li>
                <li>
                  Organization shall defend, indemnify and hold harmless
                  Laboratory from and against any liabilities, losses, damages,
                  costs and expenses (including without limitation, reasonable
                  attorneys’ fees and expenses) arising out of a claim against
                  Organization by a third party that results from Organization’s
                  breach of this Agreement, negligent acts or omissions, or
                  intentional misconduct.
                </li>
                <li>
                  UNDER NO CIRCUMSTANCES SHALL LABORATORY BE LIABLE TO
                  ORGANIZATION FOR ANY INDIRECT, SPECIAL, INCIDENTAL, PUNITIVE
                  OR CONSEQUENTIAL DAMAGES OF ANY KIND (INCLUDING LOST PROFITS)
                  REGARDLESS OF THE FORM OF ACTION WHETHER IN CONTRACT, TORT
                  (INCLUDING NEGLIGENCE), LAW, EQUITY OR OTHERWISE, EVEN IF
                  COMPANY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </li>
                <li>
                  IN NO EVENT SHALL LABORATORY’S MAXIMUM AGGREGATE LIABILITY
                  ARISING OUT OF OR RELATED TO THIS AGREEMENT (INCLUDING FOR ANY
                  CLAIM AND/OR SERIES OF CLAIMS, WHETHER RELATED OR UNRELATED)
                  WHETHER IN CONTRACT OR TORT (INCLUDING NEGLIGENCE), LAW,
                  EQUITY OR OTHERWISE, EXCEED THE AMOUNTS PAID BY ORGANIZATION
                  TO LABORATORY FOR SERVICES OF COMPANY DURING THE NINETY DAY
                  (90) PERIOD PRECEDING THE EVENT(S) GIVING RISE TO THE CLAIM
                  (OR TO THE FIRST CLAIM IN A SERIES OF CLAIMS).
                </li>
              </ul>
            </li>
            <li>
              <Text className="font-weight-bold">Intellectual Property.</Text>{' '}
              «Intellectual Property» means any intellectual property rights
              including, without limitation, rights in patents, patent
              applications, trademarks, trade-mark applications, trade secrets,
              copyright and industrial designs, Know-How or any such similar
              information or rights developed as a result of performance of
              Services and includes all Confidential Information. «Know-How»
              means (i) all information, techniques and data specifically
              relating to the Program, including, but not limited to,
              inventions, practices, methods, knowledge, know-how, skill,
              experience, test data (including without limitation
              pharmacological, toxicological, clinical, analytical and quality
              control data, regulatory submissions, correspondence and
              communications, and marketing, pricing, distribution, cost, sales,
              manufacturing, patent and legal data or descriptions), and (ii)
              compositions of matter, assays and biological materials
              specifically relating to development, manufacture, use or sale of
              the Program. Organization acknowledges and agrees that the Program
              and such Intellectual Property are owned by and proprietary to
              Laboratory and If during the course of the performance under this
              Agreement or within one (1) year after termination of this
              Agreement, Organization or a Participant conceives or actually
              reduces to practice what it/they believe/believes to be a new
              invention (including, without limitation, new uses, processes,
              formulations, therapeutic combinations or methods) occurring as a
              result of the performance of this Agreement or involving the
              Program («Improvements»), then Organization shall promptly notify
              Laboratory. The Improvements shall be the sole property of
              Laboratory, and Organization hereby assigns exclusive ownership of
              any such Improvements to Laboratory. Organization shall assist
              Laboratory, at reasonable cost, in perfecting Laboratory’s rights
              to any such Improvements.
            </li>
            <li>
              <Text className="font-weight-bold">License.</Text> This Agreement
              does not grant a license to Organization for any Intellectual
              Property owned by Laboratory.
            </li>
            <li>
              <Text className="font-weight-bold">
                No Third-Party Beneficiaries.
              </Text>{' '}
              This Agreement does not confer any rights or remedies upon any
              person or entity other than the Parties and their respective
              successors and permitted assigns, and affiliates of Laboratory.
            </li>
            <li>
              <Text className="font-weight-bold">Notices.</Text> All notices or
              reports permitted or required under this Agreement shall be in
              writing and shall be delivered by personal delivery or by
              certified or registered mail, return receipt requested, and shall
              be deemed given upon personal delivery or five (5) days after
              deposit in the mail. Notices shall be sent to the parties at the
              addresses described on the first page of this Agreement or such
              other address as either party may designate for itself in writing.
            </li>
            <li>
              <Text className="font-weight-bold">Entire Agreement.</Text> This
              Agreement and the Service Agreement constitutes the entire
              agreement among the parties with respect to the subject matter of
              this Agreement and supersedes all prior agreements (whether
              written or oral and whether express or implied) between the
              parties to the extent related to the subject matter of this
              Agreement.
            </li>
            <li>
              <Text className="font-weight-bold">Assignment.</Text> Neither this
              Agreement nor any rights or obligations of Organization hereunder
              may be assigned, sold, or otherwise transferred by Organization in
              whole or in part.
            </li>
            <li>
              <Text className="font-weight-bold">Survivorship.</Text>{' '}
              Notwithstanding anything to the contrary herein, the obligations
              under the CONFIDENTIALITY, INDEMNIFICATION, AND INTELLECTUAL
              PROPERTY shall each survive the expiration, termination or
              cancellation of this Agreement.
            </li>
            <li>
              <Text className="font-weight-bold">INDEPENDENT CONTRACTOR.</Text>{' '}
              The Parties to this Agreement will be acting as independent
              contractors and not as an agent, partner or Participant of the
              other party.
            </li>
            <li>
              <Text className="font-weight-bold">Successors and Assigns.</Text>{' '}
              This Agreement will be binding upon and inure to the benefit of
              the parties and their respective successors and permitted assigns.
            </li>
            <li>
              <Text className="font-weight-bold">Counterparts.</Text> This
              Agreement may be executed in one or more counterparts, each of
              which will be deemed an original but all of which together will
              constitute one and the same agreement. A signature of a party by
              facsimile shall be deemed to constitute an original and fully
              effective signature of such party.
            </li>
            <li>
              <Text className="font-weight-bold">Governing Law.</Text> This
              Agreement will be governed by the laws of the State of New York
              without giving effect to any choice or conflict of law principles
              of any jurisdiction.
            </li>
            <li>
              <Text className="font-weight-bold">Amendments and Waivers.</Text>{' '}
              No amendment of any provision of this Agreement will be valid
              unless the amendment is in writing and signed by each party. No
              waiver of any provision of this Agreement will be valid unless the
              waiver is in writing and signed by the waiving party. The failure
              of a party at any time to require performance of any provision of
              this Agreement will not affect such party’s rights at a later time
              to enforce such provision. No waiver by any party of any breach of
              this Agreement will be deemed to extend to any other breach
              hereunder or affect in any way any rights arising by virtue of any
              other breach.
            </li>
            <li>
              <Text className="font-weight-bold">Force Majeure.</Text> Neither
              party shall be liable hereunder by reason of any failure or delay
              in the performance of its obligations hereunder (except for the
              payment of money) on account of strikes, shortages, riots,
              insurrection, fires, flood, storm, explosions, acts of God, war,
              governmental action, labor conditions, earthquakes, material
              shortages, pandemics (except insofar as the current COVID-19
              pandemic limitations are not changed), or any other cause which is
              beyond the reasonable control of such party.
            </li>
            <li>
              <Text className="font-weight-bold">Headings.</Text> The section
              headings appearing in this Agreement are inserted only as a matter
              of convenience and in no way define, limit, construe, or describe
              the scope or extent of such section or in any way affect this
              Agreement.
            </li>
            <li>
              <Text className="font-weight-bold">Severability.</Text> Any
              provision of this Agreement that is determined by any court of
              competent jurisdiction to be invalid or unenforceable will not
              affect the validity or enforceability of any other provision
              hereof or the invalid or unenforceable provision in any other
              situation or in any other jurisdiction. Any provision of this
              Agreement held invalid or unenforceable only in part or degree
              will remain in full force and effect to the extent not held
              invalid or unenforceable.
            </li>
            <li>
              <Text className="font-weight-bold">Survival.</Text> In the event
              of termination of this Agreement, the obligations under Sections
              9–12 shall survive.
            </li>
          </ol>
        </Paragraph>
        <Checkbox
          className="text-dark font-size-30 my-3"
          onChange={() => agree(!isAgreed)}
        >
          I agree to the Terms and Conditions
        </Checkbox>
      </Content>
      <Footer className={`${style.footer} fixed-bottom text-center`}>
        <Button
          type="primary"
          size="large"
          className={`${style.button} text-center text-uppercase btn btn-info w-30 font-size-16`}
          htmlType="submit"
          disabled={!isAgreed}
          loading={isAccepting}
        >
          Continue
        </Button>
      </Footer>
    </Layout>
  );
};

export default TermsAndConditions;
