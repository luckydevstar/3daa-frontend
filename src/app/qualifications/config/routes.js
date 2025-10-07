import React from 'react';
import { Route, IndexRoute } from 'react-router';

import QualificationsSectorSelectionRoute from '../containers/qualifications-sector-selection-route';
import QualificationsRoute from '../containers/qualifications-route';
import QualificationEditRoute from '../containers/qualification-edit-route';

import WorkbooksEditorRoute from '../containers/workbooks-editor-route';
import WorkbooksUnitViewRoute from '../containers/workbooks-unit-view-route';
import WorkbookPreview from 'app/workbooks/components/workbook-preview/workbook-preview';

const QualificationsRoutes = (
  <Route>
    <IndexRoute component={QualificationsSectorSelectionRoute} />
    <Route
      path="qualifications/sector-selection"
      component={QualificationsSectorSelectionRoute}
    />
    <Route path="qualifications/:sector" component={QualificationsRoute} />
    <Route
      path="qualifications/:sector/:qualification_id"
      component={QualificationEditRoute}
    />

    <Route
      path="qualifications/:sector/:qualification_id/:unit_id"
      component={QualificationEditRoute}
    />

    <Route
      path="qualifications/:sector/:qualification_id/:unit_id/add"
      component={QualificationEditRoute}
    />

    <Route
      path="qualifications/:sector/:qualification_id/:unit_id/edit"
      component={QualificationEditRoute}
    />

    <Route
      path="qualifications/:sector/:qualification_id/:unit_id/outcomes"
      component={QualificationEditRoute}
    />

    <Route
      path="qualifications/:sector/:qualification_id/:unit_id/workbook(/:workbook_id)"
      component={WorkbooksUnitViewRoute}
    />

    <Route
      path="qualifications/:sector/:qualification_id/:unit_id/workbook/:workbook_id/editor"
      component={WorkbooksEditorRoute}
    >
      <Route path="preview" component={WorkbookPreview} />
    </Route>
  </Route>
);

export default QualificationsRoutes;
