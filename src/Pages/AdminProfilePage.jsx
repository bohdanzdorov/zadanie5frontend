import {useState, useEffect, Fragment} from "react";
import {useNavigate} from "react-router-dom";
import {Card} from "primereact/card";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import {Password} from "primereact/password";
import {Toast} from "primereact/toast";
import {Dropdown} from "primereact/dropdown";
import {TabView, TabPanel} from "primereact/tabview";
import {Tag} from "primereact/tag";
import {useRef} from "react";
import axios from "axios";
import "../Styles/AuthPages.css";
import {useTranslation} from "react-i18next";

export default function AdminProfilePage() {
    const { t, i18n } = useTranslation();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setLazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        search: "",
        role: null
    });

    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [userTestsDialog, setUserTestsDialog] = useState(false);
    const [user, setUser] = useState(null);
    const [userTests, setUserTests] = useState([]);
    // const [userCompletedTests, setUserCompletedTests] = useState([]);
    const [testsLoading, setTestsLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);
    const navigate = useNavigate();

    const API = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

    const roleOptions = [
        {label: "Guest", value: 'guest'},
        {label: "User", value: 'user'},
        {label: "Admin", value: 'admin'}
    ];

    const languageOptions = [
        {label: t('registration.language.english'), value: 'en'},
        {label: t('registration.language.slovak'), value: 'sk'}
    ];

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userRole = localStorage.getItem("role");

        if (!token || userRole !== "admin") {
            navigate("/", {replace: true});
            return;
        }

        loadUsers();
    }, [lazyState, navigate]);

    const loadUsers = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        try {
            let url = `${API}/admin/users?page=${lazyState.page + 1}&per_page=${lazyState.rows}`;

            if (lazyState.search) {
                url += `&search=${encodeURIComponent(lazyState.search)}`;
            }

            if (lazyState.role) {
                url += `&role=${lazyState.role}`;
            }

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(response.data.data);
            setTotalRecords(response.data.total);
        } catch (err) {
            console.error("Error loading users:", err);
            if (err.response?.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                navigate("/login", {replace: true});
            }
            toast.current.show({severity: 'error', summary: t('adminProfilePage.errorMessage.summary'), detail: t('adminProfilePage.errorMessage.errorLoadUsers'), life: 3000});
        } finally {
            setLoading(false);
        }
    };

    // Changes to loadUserTests function
    const loadUserTests = async (userId) => {
        setTestsLoading(true);
        const token = localStorage.getItem("token");

        try {
            // Load user tests with updated API structure
            const response = await axios.get(`${API}/admin/users/${userId}/tests`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Process tests from the new API structure
            const tests = response.data.data.map(test => ({
                id: test.id,
                created_at: test.location.start_time,
                location: test.location ? {
                    country: test.location.country,
                    city: test.location.city,
                    start_time: test.location.start_time
                } : null,
                total_questions: test.statistics.total_questions,
                correct_answers: test.statistics.correct_answers,
                accuracy_percent: test.statistics.accuracy_percent,
                total_time_spent: test.statistics.total_time_spent,
                average_time: test.statistics.average_time_per_question,
                questions: test.questions || []
            }));

            setUserTests(tests);
        } catch (err) {
            console.error("Error loading user tests:", err);
            toast.current.show({
                severity: 'error',
                summary: t('adminProfilePage.errorMessage.summary'),
                detail: t('adminProfilePage.errorMessage.errorLoadUserTests'),
                life: 3000
            });
        } finally {
            setTestsLoading(false);
        }
    };

    const openNew = () => {
        setUser({
            name: '',
            email: '',
            password: '',
            role: 'user',
            language: 'en'
        });
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideUserTestsDialog = () => {
        setUserTestsDialog(false);
        setUserTests([]);
        // setUserCompletedTests([]);
    };
    const formatTimeSpent = (seconds) => {
        if (seconds < 60) {
            return `${seconds} sec`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return remainingSeconds > 0 ?
                `${minutes} min ${remainingSeconds} sec` :
                `${minutes} min`;
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    const saveUser = async () => {
        setSubmitted(true);

        if (user.name?.trim() && user.email?.trim()) {
            const token = localStorage.getItem("token");
            try {
                if (user.id) {
                    // Update existing user
                    const updateData = {...user};
                    if (!updateData.password) {
                        delete updateData.password;
                    }

                    await axios.put(`${API}/admin/users/${user.id}`, updateData, {
                        headers: {Authorization: `Bearer ${token}`}
                    });

                    toast.current.show({severity: 'success', summary: t('adminProfilePage.successMessage.summary'), detail: t('adminProfilePage.successMessage.updatedUser'), life: 3000});
                } else {
                    // Create new user
                    await axios.post(`${API}/admin/users`, user, {
                        headers: {Authorization: `Bearer ${token}`}
                    });

                    toast.current.show({severity: 'success', summary: t('adminProfilePage.successMessage.summary'), detail: t('adminProfilePage.successMessage.createdUser'), life: 3000});
                }

                hideDialog();
                loadUsers();
            } catch (err) {
                console.error('Error saving user:', err);

                if (err.response?.data?.errors) {
                    const validationErrors = Object.values(err.response.data.errors).flat().join(', ');
                    toast.current.show({severity: 'error', summary: 'Error', detail: validationErrors, life: 3000});
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: t('adminProfilePage.errorMessage.summary'),
                        detail: err.response?.data?.message || t('adminProfilePage.errorMessage.errorSaveUser'),
                        life: 3000
                    });
                }
            }
        }
    };

    const editUser = (user) => {
        setUser({...user, password: ''});
        setUserDialog(true);
    };

    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const viewUserTests = (user) => {
        setUser(user);
        setUserTestsDialog(true);
        loadUserTests(user.id);
    };

    const deleteUser = async () => {
        const token = localStorage.getItem("token");

        try {
            await axios.delete(`${API}/admin/users/${user.id}`, {
                headers: {Authorization: `Bearer ${token}`}
            });

            toast.current.show({severity: 'success', summary: t('adminProfilePage.successMessage.summary'), detail: t('adminProfilePage.successMessage.deleteUser'), life: 3000});
            setDeleteUserDialog(false);
            loadUsers();
        } catch (err) {
            console.error('Error deleting user:', err);
            toast.current.show({
                severity: 'error',
                summary: t('adminProfilePage.errorMessage.summary'),
                detail: err.response?.data?.message || t('adminProfilePage.errorMessage.errorDeleteUser'),
                life: 3000
            });
        }
    };

    const onPage = (event) => {
        setLazyState(prevState => ({
            ...prevState,
            page: event.page,
            first: event.first,
            rows: event.rows
        }));
    };

    const onFilter = (e) => {
        setLazyState(prevState => ({
            ...prevState,
            page: 0,
            first: 0,
            search: e.target.value
        }));
    };

    const onRoleFilter = (e) => {
        setLazyState(prevState => ({
            ...prevState,
            page: 0,
            first: 0,
            role: e.value
        }));
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button
                    icon="pi pi-eye"
                    rounded outlined
                    severity="info"
                    onClick={() => viewUserTests(rowData)}
                    tooltip={t('adminProfilePage.actionBodyTemplate.view')}
                    tooltipOptions={{position: 'bottom'}}
                />
                <Button
                    icon="pi pi-pencil"
                    rounded outlined
                    onClick={() => editUser(rowData)}
                    tooltip={t('adminProfilePage.actionBodyTemplate.edit')}
                    tooltipOptions={{position: 'bottom'}}
                />
                <Button
                    icon="pi pi-trash"
                    rounded outlined
                    severity="danger"
                    onClick={() => confirmDeleteUser(rowData)}
                    tooltip={t('adminProfilePage.actionBodyTemplate.delete')}
                    tooltipOptions={{position: 'bottom'}}
                />
            </div>
        );
    };
    //
    // const dateBodyTemplate = (rowData) => {
    //     return new Date(rowData.created_at).toLocaleString();
    // };
    //
    // const scoreBodyTemplate = (rowData) => {
    //     return (
    //         <Tag
    //             value={`${rowData.score || 0}%`}
    //             severity={rowData.score >= 70 ? 'success' : rowData.score >= 40 ? 'warning' : 'danger'}
    //         />
    //     );
    // };

    const header = (
        <div className="flex flex-wrap justify-content-between align-items-center gap-2">
            <h3 className="m-0">{t('adminProfilePage.header.title')}</h3>
            <div className="flex gap-2">
                <InputText
                    placeholder={t('adminProfilePage.header.searchText')}
                    value={lazyState.search}
                    onChange={onFilter}
                />
                <Dropdown
                    value={lazyState.role}
                    options={roleOptions}
                    onChange={onRoleFilter}
                    placeholder={t('adminProfilePage.header.filterText')}
                    className="w-full md:w-14rem"
                    showClear
                />
                <Button label={t('adminProfilePage.header.button')} icon="pi pi-plus" onClick={openNew}/>
            </div>
        </div>
    );

    const userDialogFooter = (
        <Fragment>
            <Button label={t('adminProfilePage.userDialogFooter.cancelButton')} icon="pi pi-times" outlined onClick={hideDialog}/>
            <Button label={t('adminProfilePage.userDialogFooter.saveButton')} icon="pi pi-check" onClick={saveUser}/>
        </Fragment>
    );

    const deleteUserDialogFooter = (
        <Fragment>
            <Button label={t('adminProfilePage.deleteUserDialog.no')} icon="pi pi-times" outlined onClick={hideDeleteUserDialog}/>
            <Button label={t('adminProfilePage.deleteUserDialog.yes')} icon="pi pi-check" severity="danger" onClick={deleteUser}/>
        </Fragment>
    );

    return (
        <div className="admin-container" style={{padding: '2rem', width: '80%', margin: '0 auto'}}>
            <Toast ref={toast}/>

            <Card title={t('adminProfilePage.title')} style={{marginBottom: '2rem'}}>
                <p>{t('adminProfilePage.description')}</p>
            </Card>

            <Card>
                <DataTable
                    value={users}
                    lazy
                    paginator
                    dataKey="id"
                    rows={lazyState.rows}
                    rowsPerPageOptions={[5, 10, 25]}
                    totalRecords={totalRecords}
                    first={lazyState.first}
                    onPage={onPage}
                    loading={loading}
                    header={header}
                    emptyMessage={t('adminProfilePage.noUsersFound')}
                    style={{width: '100%'}}
                    scrollable
                    scrollHeight="400px"
                >
                    <Column field="id" header="ID" sortable style={{width: '5%'}}></Column>
                    <Column field="name" header={t('registration.name')} sortable style={{width: '20%'}}></Column>
                    <Column field="email" header={t('registration.email')} sortable style={{width: '30%'}}></Column>
                    <Column field="role" header={t('adminProfilePage.roles.title')} sortable style={{width: '15%'}}></Column>
                    <Column field="language" header={t('registration.language.name')} sortable style={{width: '15%'}}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{width: '15%'}}></Column>
                </DataTable>
            </Card>

            {/* Edit User Dialog */}
            <Dialog
                visible={userDialog}
                style={{width: '500px'}}
                header={user?.id ? t('adminProfilePage.editDialog.edit') : t('adminProfilePage.editDialog.new')}
                modal
                className="p-fluid"
                footer={userDialogFooter}
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="name">{t('registration.name')}</label>
                    <InputText
                        id="name"
                        value={user?.name}
                        onChange={(e) => setUser(prev => ({...prev, name: e.target.value}))}
                        required
                        className={submitted && !user?.name ? 'p-invalid' : ''}
                    />
                    {submitted && !user?.name && <small className="p-error">{t('adminProfilePage.requiredFields.name')}</small>}
                </div>

                <div className="field">
                    <label htmlFor="email">{t('registration.email')}</label>
                    <InputText
                        id="email"
                        value={user?.email}
                        onChange={(e) => setUser(prev => ({...prev, email: e.target.value}))}
                        required
                        className={submitted && !user?.email ? 'p-invalid' : ''}
                    />
                    {submitted && !user?.email && <small className="p-error">{t('adminProfilePage.requiredFields.email')}</small>}
                </div>

                <div className="field">
                    <label htmlFor="password">{user?.id ? t('adminProfilePage.passwordAdditionalInfo') : t('registration.password')}</label>
                    <Password
                        id="password"
                        value={user?.password}
                        onChange={(e) => setUser(prev => ({...prev, password: e.target.value}))}
                        toggleMask
                        className={submitted && !user?.password && !user?.id ? 'p-invalid' : ''}
                        feedback={true}
                        promptLabel={t('registration.enterPassword')}
                        weakLabel={t('registration.passwordStrength.weak')}
                        mediumLabel={t('registration.passwordStrength.medium')}
                        strongLabel={t('registration.passwordStrength.strong')}
                    />
                    {submitted && !user?.password && !user?.id &&
                        <small className="p-error">{t('adminProfilePage.requiredFields.password')}</small>}
                </div>

                <div className="field">
                    <label htmlFor="role">{t('adminProfilePage.roles.title')}</label>
                    <Dropdown
                        id="role"
                        value={user?.role}
                        options={roleOptions}
                        onChange={(e) => setUser(prev => ({...prev, role: e.value}))}
                        placeholder={t('adminProfilePage.roles.selectText')}
                        required
                        className={submitted && !user?.role ? 'p-invalid' : ''}
                    />
                    {submitted && !user?.role && <small className="p-error">{t('adminProfilePage.requiredFields.role')}</small>}
                </div>

                <div className="field">
                    <label htmlFor="language">{t('registration.language.name')}</label>
                    <Dropdown
                        id="language"
                        value={user?.language}
                        options={languageOptions}
                        onChange={(e) => setUser(prev => ({...prev, language: e.value}))}
                        placeholder={t('adminProfilePage.editDialog.languageSelectText')}
                        required
                        className={submitted && !user?.language ? 'p-invalid' : ''}
                    />
                    {submitted && !user?.language && <small className="p-error">{t('adminProfilePage.requiredFields.language')}</small>}
                </div>
            </Dialog>

            <Dialog
                visible={deleteUserDialog}
                style={{width: '450px'}}
                header={t('adminProfilePage.deleteDialog.header')}
                modal
                footer={deleteUserDialogFooter}
                onHide={hideDeleteUserDialog}
            >
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle"
                       style={{fontSize: '2rem', color: 'var(--red-500)', marginRight: '1rem'}}/>
                    <span>
            {t('adminProfilePage.deleteDialog.deleteTextInfo')} <b>{user?.name}</b>?
          </span>
                </div>
            </Dialog>
            <Dialog
                visible={userTestsDialog}
                style={{width: '80%'}}
                header={i18n.language === "en" ? `${user?.name}'s Tests` : `Testy ${user?.name}`}
                modal
                className="p-fluid"
                onHide={hideUserTestsDialog}
            >
                {testsLoading ? (
                    <p>{t('adminProfilePage.usersTable.loadingTests')}</p>
                ) : (
                    <DataTable
                        value={userTests}
                        emptyMessage={t('adminProfilePage.usersTable.emptyTests')}
                        paginator
                        rows={5}
                        rowsPerPageOptions={[5, 10]}
                        scrollable
                        scrollHeight="300px"
                    >
                        <Column field="id" header="ID" style={{width: '5%'}}></Column>
                        <Column
                            field="created_at"
                            header={t('profilePage.testsHistory.table.date')}
                            body={(rowData) => formatDate(rowData.created_at)}
                            style={{width: '15%'}}
                        ></Column>
                        <Column
                            field="location"
                            header={t('registration.language.name')}
                            body={(rowData) => rowData.location ?
                                `${rowData.location.city?.en || 'Unknown'}, ${rowData.location.country?.en || 'Unknown'}` :
                                'Unknown'
                            }
                            style={{width: '15%'}}
                        ></Column>
                        <Column
                            field="total_questions"
                            header={t('adminProfilePage.usersTable.questions')}
                            style={{width: '10%'}}
                        ></Column>
                        <Column
                            field="correct_answers"
                            header={t('profilePage.testsHistory.table.correct')}
                            style={{width: '10%'}}
                        ></Column>
                        <Column
                            field="accuracy_percent"
                            header={t('profilePage.testsHistory.table.total')}
                            body={(rowData) => (
                                <Tag
                                    value={`${rowData.accuracy_percent}%`}
                                    severity={rowData.accuracy_percent >= 70 ? 'success' :
                                        rowData.accuracy_percent >= 40 ? 'warning' : 'danger'}
                                />
                            )}
                            style={{width: '10%'}}
                        ></Column>
                        <Column
                            field="total_time_spent"
                            header={t('testResultMenu.timeSpent')}
                            body={(rowData) => formatTimeSpent(rowData.total_time_spent)}
                            style={{width: '15%'}}
                        ></Column>
                    </DataTable>
                )}
            </Dialog>
        </div>
    );
}