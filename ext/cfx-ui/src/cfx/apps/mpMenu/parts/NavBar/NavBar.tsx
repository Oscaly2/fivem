import { observer } from 'mobx-react-lite';
import React from 'react';

import { useService } from 'cfx/base/servicesContainer';
import { useEventHandler } from 'cfx/common/services/analytics/analytics.service';
import { EventActionNames, ElementPlacements } from 'cfx/common/services/analytics/types';
import { $L } from 'cfx/common/services/intl/l10n';
import { ISettingsUIService } from 'cfx/common/services/settings/settings.service';
import { Badge } from 'cfx/ui/Badge/Badge';
import { Button, ButtonTheme } from 'cfx/ui/Button/Button';
import { ButtonBar } from 'cfx/ui/Button/ButtonBar';
import { Icons } from 'cfx/ui/Icons';
import { Box } from 'cfx/ui/Layout/Box/Box';
import { Flex } from 'cfx/ui/Layout/Flex/Flex';
import { Title } from 'cfx/ui/Title/Title';

import { Exitter } from './Exitter/Exitter';
import { HomeButton } from './HomeButton/HomeButton';
import { NavBarState } from './NavBarState';
import { UserBar } from './UserBar/UserBar';
import { IChangelogService } from '../../services/changelog/changelog.service';

export const NavBar = observer(function NavBar() {
  const ChangelogService = useService(IChangelogService);
  const SettingsUIService = useService(ISettingsUIService);
  const eventHandler = useEventHandler();

  const handleChangelogClick = React.useCallback(() => {
    eventHandler({
      action: EventActionNames.SiteNavClick,
      properties: {
        text: '#Changelogs',
        link_url: '/changelog',
        element_placement: ElementPlacements.Nav,
        position: 0,
      },
    });
  }, [eventHandler]);

  const handleSettingsClick = React.useCallback(() => {
    SettingsUIService.open();
    eventHandler({
      action: EventActionNames.SiteNavClick,
      properties: {
        text: '#BottomNav_Settings',
        link_url: '/',
        element_placement: ElementPlacements.Nav,
        position: 0,
      },
    });
  }, [eventHandler, SettingsUIService]);

  React.useEffect(() => {
    NavBarState.setReady();

    return NavBarState.setNotReady;
  }, []);

  const buttonTheme: ButtonTheme = NavBarState.forceTransparentNav
    ? 'default'
    : 'default-blurred';

  return (
    <Flex repell centered gap="large">
      {NavBarState.homeButtonVisible
        ? (
          <HomeButton />
          )
        : null}

      <Box grow ref={NavBarState.outletRef} />

      <UserBar />

      <ButtonBar>
        <Title title={$L('#Changelogs')}>
          <Button
            to="/changelog"
            size="large"
            theme={buttonTheme}
            icon={Icons.changelog}
            onClick={handleChangelogClick}
            decorator={
              ChangelogService.unreadVersionsCount
                ? (
                  <Badge>{ChangelogService.unreadVersionsCount}</Badge>
                  )
                : null
            }
          />
        </Title>
        <Title title={$L('#BottomNav_Settings')}>
          <Button size="large" theme={buttonTheme} icon={Icons.settings} onClick={handleSettingsClick} />
        </Title>
      </ButtonBar>

      <Exitter />
    </Flex>
  );
});
