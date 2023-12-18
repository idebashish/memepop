document.addEventListener('DOMContentLoaded', function() {
    const optionsForm = document.getElementById('options-form');
    const refreshIntervalInput = document.getElementById('refresh-interval');

    // Load the saved refresh interval from storage
    chrome.storage.sync.get('refreshInterval', function(data) {
        refreshIntervalInput.value = data.refreshInterval || 10;
    });

    // Save the refresh interval to storage
    optionsForm.addEventListener('submit', function(event) {
        event.preventDefault();
        chrome.storage.sync.set({
            'refreshInterval': refreshIntervalInput.value
        }, function() {
            // Notify that we saved the refresh interval
            console.log('Refresh interval set to', refreshIntervalInput.value);
        });
    });
});
