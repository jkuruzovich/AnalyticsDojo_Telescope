/**
 * Created by jkuruzovich on 10/21/15.
 */

Template.header.helpers({
    headerClass: function () {
        var headerClass = "";
        var bgBrightness = tinycolor(Settings.get('headerColor')).getBrightness();
        if (bgBrightness < 50) {
            headerClass += " white-bg";
        }
        return headerClass;
    },
    hasPrimaryNav: function () {
        return !!Telescope.modules.get("primaryNav").length;
    },
    hasSecondaryNav: function () {
        return !!Telescope.modules.get("secondaryNav").length;
    },
    dropdownClass: function () {
        var dropdownClass = "";
        // only use dropdowns for top nav
        if (this.length > 3) {
            dropdownClass += "long-dropdown";
        }
        if (Settings.get('navLayout', 'top-nav') === 'top-nav' && getThemeSetting('useDropdowns', true)) {
            dropdownClass += "has-dropdown";
        } else {
            dropdownClass += "no-dropdown";
        }
        return dropdownClass;
    },
    hasMoreThanThreeItems: function () {
        return this.length > 3;
    }
});

